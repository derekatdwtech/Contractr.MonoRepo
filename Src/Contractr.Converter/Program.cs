using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Azure.Identity;
using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Contractr.Converter.Services;
using Contractr.Converter.Config;
using Contractr.Converter.Utils;
using Microsoft.Extensions.Logging;

namespace Contractr.Converter
{
    internal class Program
    {

        /*******************************************************************************
        /********************************** NOTICE !! **********************************
        /**** These constants can change when you want to test this utility locally. ***
        /*******************************************************************************/

        // This value can be any word document. See sample_docs directory for more test documents.
        const string fileName = "apas1.doc";
        // Folder where your document is located.
        const string documentPath = "../../../sample_docs/";
        const string outputDirectory = $"../../../signature_pages/";
        // Execution mode set via ENV variable. Can be local or service. Default: local.
        static string EXECUTION_MODE = Environment.GetEnvironmentVariable("EXECUTION_MODE")?.ToLower() ?? "service";
        static async Task<int> Main(string[] args)
        {
            // Create host builder to setup dependency injection  
            var host = CreateHostBuilder(args).Build();
            switch (EXECUTION_MODE)
            {
                case "local":
                    // parseDocument(fileName, documentPath, outputDirectory);
                    return Environment.ExitCode;

                case "service":
                    using (host)
                    {
                        await host.RunAsync();
                        await host.WaitForShutdownAsync();
                    }

                    return Environment.ExitCode;
                default:
                    // parseDocument(fileName, documentPath, outputDirectory);
                    return Environment.ExitCode;
            }
        }
        private static IHostBuilder CreateHostBuilder(string[] args)
        {
            var builder = Host.CreateDefaultBuilder(args);

            builder.ConfigureAppConfiguration((hostContext, config) =>
            {
                string? kvUrl = Environment.GetEnvironmentVariable("KeyVaultUrl");
                if (!String.IsNullOrEmpty(kvUrl))
                {
                    config.AddAzureKeyVault(new Uri(kvUrl), new DefaultAzureCredential(), new AzureKeyVaultConfigurationOptions
                    {
                        ReloadInterval = TimeSpan.FromMinutes(1)
                    });
                }
                config.AddEnvironmentVariables();
                config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: false);


            })
            .ConfigureServices((hostContext, service) =>
            {
                service.AddLogging(configure =>
                {
                    configure.ClearProviders();
                    configure.AddConsole();
                });
                service.AddApplicationInsightsTelemetryWorkerService();
                service.Configure<DatabaseConfiguration>(x =>
                {
                    x.ConnectionString = hostContext.Configuration.GetConnectionString("ContractrDatabase");
                });
                service.Configure<ServiceBusConfiguration>(x =>
                {
                    x.DocumentQueueListen = hostContext.Configuration.GetConnectionString("DocumentQueueListen");
                    x.DocumentParseQueueSend = hostContext.Configuration.GetConnectionString("DocumentParseQueueSend");
                    x.StatusQueueSend = hostContext.Configuration.GetConnectionString("StatusQueueSend");
                });

                service.Configure<BlobStorageConfiguration>(x => x.ConnectionString = hostContext.Configuration.GetConnectionString("DocumentBlobStorage"));
                service.AddHostedService<Worker>();
                service.AddTransient<IServiceBus, ServiceBus>();
                service.AddScoped<IDatabaseProvider, DatabaseProvider>();
                service.AddScoped<IBlobStorage, BlobStorage>();
                service.AddScoped<IPdfUtils, PdfUtils>();
            });

            return builder;

        }
    }
}