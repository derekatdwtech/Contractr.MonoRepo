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
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private IUser _service;
    public UserController(ILogger<UserController> logger, IUser service)
    {
        _logger = logger;
        _service = service;
    }
    [Authorize]
    [HttpGet("")]
    public IActionResult Get()
    {
        string owner = User.Claims.Where(x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault()?.Value;
        User user = _service.GetUserById(owner);
        if (user == null || user.id == "")
        {
            return NotFound("User profile was not found. Please setup your profile to continue.");
        }
        else
        {
            return Ok(user);
        }

    }
    [Authorize]
    [HttpPost("")]
    public IActionResult AddUser(User user)
    {
        try
        {

            User result = _service.AddUser(user);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPut("")]
    public IActionResult UpdateUser(User user)
    {
        try
        {

            User result = _service.UpdateUser(user);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
