using Microsoft.AspNetCore.Mvc;
using BW_API.Data;
using BW_API.Models;
using BW_API.Dtos;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace BW_API.Controllers
{
    [Authorize]
    [ApiController]
    public class WheelController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public WheelController(ApplicationDbContext db)
        {   
            _db = db;
        }

        [HttpGet("api/get-wheels")]
        
        public IEnumerable<Wheel> GetWheels()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            IEnumerable<Wheel> objWheelList = _db.Wheels.Where(w => w.UserId == userId);
            return objWheelList;
        }

        [HttpGet("api/get-wheel/{id}")]
        public async Task<Wheel> GetWheel(Guid id)
        {
            var wheel = await _db.Wheels.FindAsync(id);
            if (wheel == null) {
                throw new KeyNotFoundException("Wheel not found");
            }
            return wheel;
        }

        [HttpPost("api/create-wheel")]
        public async Task<IActionResult> Create(WheelUpdateDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var wheel = new Wheel { LayersJson = model.LayersJson, UserId = userId };
            _db.Wheels.Add(wheel);
            await _db.SaveChangesAsync();
            
            return Ok(new { message = "Wheel created successfully", id = wheel.Id });
        }

        [HttpPut("api/update-wheel/{id}")]
        public async Task<IActionResult> UpdateWheel(Guid id, [FromBody] WheelUpdateDto model)
        {
            var wheel = await _db.Wheels.FindAsync(id);
            if (wheel == null)
            {
                return NotFound(new { message = "Wheel not found" });
            }
            
            // Ensure the current user owns this wheel
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (wheel.UserId != userId)
            {
                return Forbid(); // 403 Forbidden if the user doesn't own the wheel
            }

            // Update fields
            wheel.LayersJson = model.LayersJson;
            wheel.ModifiedAt = DateTime.UtcNow;

            _db.Wheels.Update(wheel);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Wheel updated successfully" });
        }

        [HttpDelete("api/delete-wheel/{id}")]
        public async Task<IActionResult> DeleteWheel(Guid id)
        {
            var wheel = await _db.Wheels.FindAsync(id);
            if (wheel == null)
            {
                return NotFound(new { message = "Wheel not found" });
            }

            _db.Wheels.Remove(wheel);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Wheel updated successfully" });
        }
    }
}

