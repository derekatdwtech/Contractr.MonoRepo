using System;
using System.Linq;
using System.Security.Claims;
using Contractr.Entities;
using Contractr.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Contractr.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class OrganizationController : ControllerBase
{
    private readonly ILogger<OrganizationController> _logger;
    private IOrganization _service;

    public OrganizationController(ILogger<OrganizationController> logger, IOrganization service)
    {
        _logger = logger;
        _service = service;
    }

    [Authorize]
    [HttpGet("owner")]
    public IActionResult GetOrganizationByOwner()
    {
        var owner = User.Claims.Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
        try
        {
            var result = _service.GetOrganizationByOwner(owner);

            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return NotFound();
            }
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpPost("")]
    public IActionResult AddOrganization(Organization organization)
    {
        var owner = User.Claims.Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
        organization.owner = owner;
        try
        {
            _service.AddOrganization(organization);

            return Ok($"Successfully added organization {organization.name}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return BadRequest(ex.Message);
        }
    }
}
