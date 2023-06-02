using System;
using System.Collections.Generic;
using Contractr.Entities.Config;
using Contractr.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Azure.Identity;
using Microsoft.Extensions.Configuration;
using Azure.Extensions.AspNetCore.Configuration.Secrets;

var builder = WebApplication.CreateBuilder(args);

// Add App Insights
builder.Services.AddApplicationInsightsTelemetry();

string kvUrl = Environment.GetEnvironmentVariable("KeyVaultUrl");
if (!String.IsNullOrEmpty(kvUrl))
{
    // Add Azure Key Vault
    builder.Configuration.AddAzureKeyVault(new Uri(kvUrl), new DefaultAzureCredential(), new AzureKeyVaultConfigurationOptions
    {
        ReloadInterval = TimeSpan.FromMinutes(1)
    });
}
else
{
    builder.Configuration.AddJsonFile("local.settings.json", optional: true, reloadOnChange: false);
}

// Configure Application Settings
builder.Services.Configure<DatabaseConfiguration>(x => x.ConnectionString = builder.Configuration.GetConnectionString("ContractrDatabase"));
builder.Services.Configure<BlobStorageConfiguration>(x => x.ConnectionString = builder.Configuration.GetConnectionString("DocumentBlobStorage"));
builder.Services.Configure<ServiceBusConfiguration>(x =>
{
    x.StatusQueueSend = builder.Configuration.GetConnectionString("StatusQueueSend");
    x.DocumentQueueSend = builder.Configuration.GetConnectionString("DocumentQueueSend");
});
builder.Services.Configure<Auth0Configuration>(builder.Configuration.GetSection("Auth0"));


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "devPolicy",
                      policy =>
                      {
                          policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().WithExposedHeaders("X-Pagination");
                      });

});

// Add Swagger Endpoint
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Contractr API",
        Description = "",
        TermsOfService = new Uri("https://example.com/terms"),
        Contact = new OpenApiContact
        {
            Name = "Derek Williams",
            Url = new Uri("mailto:derekcwilliams@protonmail.com")
        }
    });
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        BearerFormat = "JWT",
        Flows = new OpenApiOAuthFlows
        {
            Implicit = new OpenApiOAuthFlow
            {
                TokenUrl = new Uri($"https://{builder.Configuration["Auth0:Domain"]}/oauth/token"),
                AuthorizationUrl = new Uri($"https://{builder.Configuration["Auth0:Domain"]}/authorize?audience={builder.Configuration["Auth0:Audience"]}"),
                Scopes = new Dictionary<string, string>
                  {
                      { "openid", "OpenId" },

                  }
            }
        }
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
      {
          {
              new OpenApiSecurityScheme
              {
                  Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "oauth2" }
              },
              new[] { "openid" }
          }
      });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, a =>
{
    a.Authority = $"https://{builder.Configuration["Auth0:Domain"]}";
    a.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidAudience = builder.Configuration["Auth0:Audience"],
        ValidIssuer = $"https://{builder.Configuration["Auth0:Domain"]}"
    };
});

// Configure DI
builder.Services.AddScoped<IDatabaseProvider, DatabaseProvider>();
builder.Services.AddScoped<IBlobService, BlobService>();
builder.Services.AddScoped<IDeal, DealRepository>();
builder.Services.AddScoped<IDocument, DocumentService>();
builder.Services.AddScoped<IOrganization, OrganizationRepository>();
builder.Services.AddScoped<IServiceBusHelper, ServiceBusHelper>();
builder.Services.AddScoped<IUser, UserRepository>();

// Add Health Checks
builder.Services.AddHealthChecks();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(settings =>
    {
        settings.OAuthClientId(builder.Configuration["Auth0:ClientId"]);
        settings.OAuthClientSecret(builder.Configuration["Auth0:ClientSecret"]);
        settings.OAuthUsePkce();
    });
}

//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/healthz");
app.UseCors("devPolicy");
app.Run();