using Contractr.Notification.Api;
using Contractr.Notification.Api.Config;
using Contractr.Notification.Api.Repository;
using Contractr.Notification.Api.Service;
using Contractr.Status.Update.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Builder;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Azure.Identity;
using Azure.Extensions.AspNetCore.Configuration.Secrets;

var builder = WebApplication.CreateBuilder(args);
// Add Application Insights
builder.Services.AddApplicationInsightsTelemetry();
// Setup Configuration Injection
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
builder.Services.Configure<DatabaseConfiguration>(x => x.ConnectionString = builder.Configuration.GetConnectionString("ContractrDatabase"));
builder.Services.Configure<NotificationQueueConfiguration>(x => x.ConnectionString = builder.Configuration.GetConnectionString("NotificationsQueueListen"));
builder.Services.Configure<Auth0Configuration>(builder.Configuration.GetSection("Auth0"));


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(a =>
{
    a.Authority = $"https://{builder.Configuration["Auth0:Domain"]}";
    a.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidAudience = builder.Configuration["Auth0:Audience"],
        ValidIssuer = $"https://{builder.Configuration["Auth0:Domain"]}"
    };

    a.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(token) && path.StartsWithSegments("/notifications"))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Contractr Notification SignalR Hub",
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

builder.Services.AddHostedService<NotificationReceiverService>();
builder.Services.AddSingleton<IServiceBus, ServiceBusHelper>();
builder.Services.AddSingleton<IOrganization, OrganizationRepository>();
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "devPolicy",
                      policy =>
                      {
                          policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000").WithExposedHeaders("X-Pagination").AllowCredentials();
                      });

});
builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("devPolicy");
// app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapHealthChecks("/healthz");
app.MapHub<NotificationHub>("/notifications");
app.Run();
