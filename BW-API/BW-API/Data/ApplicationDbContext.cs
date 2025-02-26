using System;
using System.Collections.Generic;
using System.Text;
using BW_API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace BW_API.Data
{
    public class ApplicationDbContext : IdentityDbContext 
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Instrument> Instruments { get; set; }
        public DbSet<Wheel> Wheels { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Ensures Identity tables are properly configured
            base.OnModelCreating(modelBuilder);

            // Configure Wheel Foreign Key Relationship
            modelBuilder.Entity<Wheel>()
                .HasOne(w => w.User)
                .WithMany(u => u.Wheels)
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ensure Wheel ModifiedAt is auto-updated
            modelBuilder.Entity<Wheel>()
                .Property(w => w.ModifiedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnUpdate();
        }

    }
}

