using System;
using System.ComponentModel.DataAnnotations;

namespace BW_API.Models
{
    public class Instrument
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime CreatedDateTime { get; set; } = DateTime.Now;

        //public int Sections { get; set; }

        //public Instrument()
        //{
        //}
    }
}

