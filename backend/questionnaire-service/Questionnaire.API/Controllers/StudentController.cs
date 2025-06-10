using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Questionnaire.Application.DTOs;
using Questionnaire.Application.Services;
using System.Security.Claims;

namespace Questionnaire.API.Controllers
{
    [ApiController]
    [Route("api/student/questionnaires")]
    [Authorize(Roles = "Étudiant")]
    public class StudentController : ControllerBase
    {
        private readonly StudentService _studentService;

        public StudentController(StudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPublishedQuestionnaires()
        {
            // Extract filiere code from JWT token - adjust the claim name as needed
            var filiereClaim = User.FindFirst("filiere")?.Value; // or "filiere_code", "formation", etc.
            if (string.IsNullOrEmpty(filiereClaim))
                return BadRequest("Filiere information not found in token.");

            var questionnaires = await _studentService.GetPublishedQuestionnairesForStudentAsync(filiereClaim);
            return Ok(questionnaires);
        }

        // 🆕 NEW ENDPOINT: Get specific questionnaire details
        [HttpGet("{templateCode}")]
        public async Task<IActionResult> GetQuestionnaireDetails(string templateCode)
        {
            // Extract filiere code from JWT token
            var filiereClaim = User.FindFirst("filiere")?.Value; // adjust claim name as needed
            if (string.IsNullOrEmpty(filiereClaim))
                return BadRequest("Filiere information not found in token.");

            try
            {
                var questionnaire = await _studentService.GetTemplateDetailsAsync(templateCode, filiereClaim);
                return Ok(questionnaire);
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(new { message = e.Message });
            }
        }

        [HttpPost("submit/{templateCode}")]
        public async Task<IActionResult> SubmitAnswers(string templateCode, [FromBody] SubmitAnswersRequestDto request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !Guid.TryParse(userIdClaim, out Guid userId))
                return Unauthorized();

            // Extract filiere code from JWT token
            var filiereClaim = User.FindFirst("filiere")?.Value; // adjust claim name as needed
            if (string.IsNullOrEmpty(filiereClaim))
                return BadRequest("Filiere information not found in token.");

            try
            {
                await _studentService.SubmitAnswersAsync(userId, templateCode, filiereClaim, request);
                return Ok(new { message = "Submission saved successfully." });
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(new { message = e.Message });
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
    }
}