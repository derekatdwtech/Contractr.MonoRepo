using Azure.Identity;
using Contractr.Parser.Config;
using Contractr.Parser.Services;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;

[assembly: FunctionsStartup(typeof(Contractr.Parser.Startup))]
namespace Contractr.Parser
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            // Add Application Insights
            builder.Services.AddApplicationInsightsTelemetry();
            builder.Services.AddLogging();
            // Setup Dependency Injection
            var config = BuildConfiguration();
            builder.Services.AddSingleton(config);
            builder.Services.Configure<BlobStorageConfiguration>(x => x.ConnectionString = config.GetConnectionString("DocumentBlobStorage"));
            builder.Services.Configure<DatabaseConfiguration>(x => x.ConnectionString = config.GetConnectionString("ContractrDatabase"));
            builder.Services.Configure<ServiceBusConfiguration>(x =>
            {
                x.DocumentParseQueueListen = config.GetConnectionString("DocumentParseQueueListen");
                x.NotificationQueueSend = config.GetConnectionString("NotificationQueueSend");
            });

            
            builder.Services.AddScoped<IBlobStorage, BlobStorage>();
            builder.Services.AddScoped<IDatabaseProvider, DatabaseProvider>();
            builder.Services.AddScoped<IDocumentParser, DocumentParser>();
        }

        private IConfiguration BuildConfiguration()
        {
            var localRoot = Environment.GetEnvironmentVariable("AzureWebJobsScriptRoot");
            var azureRoot = $"{Environment.GetEnvironmentVariable("HOME")}/site/wwwroot";
            var root = localRoot ?? azureRoot;
            var configBuilder = new ConfigurationBuilder()
            .SetBasePath(root)
            .AddEnvironmentVariables()
            .AddJsonFile("local.settings.json", optional: true, reloadOnChange: false);

            var kvUrl = Environment.GetEnvironmentVariable("KeyVaultUrl");
            if (!String.IsNullOrEmpty(kvUrl))
            {
                configBuilder.AddAzureKeyVault(new Uri(kvUrl), new DefaultAzureCredential());
            }

            var configuration = configBuilder.Build();
            return configuration;
        }
    }
}