using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BW_API.Dtos
{
    public class WheelDto
    {
        public Guid Id { get; set; }
        public string LayersJson { get; set; } = string.Empty;
    }
}

