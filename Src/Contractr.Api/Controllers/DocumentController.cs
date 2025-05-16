using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Contractr.Entities;
using Contractr.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Contractr.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class DocumentController : ControllerBase
{
    private readonly ILogger<DocumentController> _logger;
    private IDocument _service;

    public DocumentController(ILogger<DocumentController> logger, IDocument service)
    {
        _logger = logger;
        _service = service;
    }

    [Authorize]
    [HttpGet("")]
    public IActionResult Get(string deal_id)
    {
        try
        {
            var result = _service.GetDocuments(deal_id);
            return Ok(result);
        }
        catch (Exception e)
        {
            _logger.LogError(e.StackTrace);
            return BadRequest(e.ToProblemDetails());
        }
    }

    [Authorize]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadDocument([FromForm] IFormFile file, [FromQuery] string deal_id, [FromQuery] string uploaded_by)
    {
        if (file == null)
        {
            return BadRequest("You must specify a file.");
        }
        try
        {
            var result = await _service.UploadDocument(file, uploaded_by, deal_id);
            if (result.blob_uri != null)
            {

                return Ok(result);

            }
            else { return Conflict("File already exists"); }
        }
        catch (Exception e)
        {
            return BadRequest(e);

        }
    }

    [Authorize]
    [HttpGet("{id}/signature_pages")]
    public IActionResult GetSignaturePages(string id)
    {
        try
        {
            List<SignaturePage> pages = _service.GetSignaturePagesForDocument(id);
            if (pages.Count > 0)
            {
                return Ok(pages);
            }
            else
            {
                return Ok(new List<SignaturePage>());
            }
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

    }

    [Authorize]
    [HttpGet("{id}/signature_pages/download")]
    public async Task<IActionResult> DownloadSignaturePages(string id)
    {
        try
        {
            FileInfo file = await _service.DownloadSignaturePages(id);
            var fileBytes = await System.IO.File.ReadAllBytesAsync(file.Name);
            return File(fileBytes, "application/octet-stream", file.Name);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

    }

    [Authorize]
    [HttpPost("{id}/signed")]
    public async Task<IActionResult> UploadSignedSignaturePage(string id, [FromForm] IFormFile file)
    {
        return Ok();
    }

}
