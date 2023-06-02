using System;
using System.Collections.Generic;
using Contractr.Entities;
using Contractr.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Contractr.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class DealController : ControllerBase
{
    private readonly ILogger<DealController> _logger;
    private IDeal _service;

    public DealController(ILogger<DealController> logger, IDeal service)
    {
        _logger = logger;
        _service = service;
    }

    [Authorize]
    [HttpGet("")]
    public IActionResult GetDealsForOrganization(string organization)
    {
        if (organization == null)
        {
            return BadRequest("You must provide an organization");
        }
        try
        {
            List<Deal> results = _service.GetDealsForOrganization(organization);
            if (results.Count > 0)
            {
                return Ok(results);
            }
            else
            {
                return NoContent();
            }


        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpGet("{id}")]
    public IActionResult GetDealById(string id)
    {
        if (String.IsNullOrEmpty(id))
        {
            return BadRequest("You must provide an id");
        }
        try
        {
            Deal result = _service.GetDealById(id);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return NoContent();
            }


        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [Authorize]
    [HttpPost]
    public IActionResult AddDeal([FromBody] Deal deal)
    {

        try
        {
            Deal results = _service.AddDeal(deal);
            return Ok(results);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }


    }
}
