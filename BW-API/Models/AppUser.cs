using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace BW_API.Models;

public class AppUser:IdentityUser
{
    [PersonalData]
    [Column(TypeName ="text")]
    public string FullName { get; set; }

    public ICollection<Wheel> Wheels { get; set; }
}

