using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BW_API.Data;
using BW_API.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BW_API.Controllers
{
    public class InstrumentController : Controller
    {
        private readonly ApplicationDbContext _db;

        public InstrumentController(ApplicationDbContext db)
        {   
            _db = db;
        }
        
        public IActionResult Index()
        {
            IEnumerable<Instrument> objInstrumentList = _db.Instruments;
            return View(objInstrumentList);
        }

        [HttpGet("get-instruments")]
        public IEnumerable<Instrument> GetInstruments()
        {
            IEnumerable<Instrument> objInstrumentList = _db.Instruments;
            return objInstrumentList;
        }


        //GET
        public IActionResult Create()
        {
            return View();
        }

        //POST
        [HttpPost]
        [ValidateAntiForgeryToken] //prevents cross site request forgery - research@dotnetmastery.com Free Content
        public IActionResult Create(Instrument obj)
        {
            if (obj.Name == obj.DisplayOrder.ToString())
            {
                //ModelState.AddModelError("name", "The DsiplayOrder cannot exactly match the Name");
                ModelState.AddModelError("CustomError", "The DsiplayOrder cannot exactly match the Name");
            }
            if (ModelState.IsValid)
            {
                _db.Instruments.Add(obj);
                _db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(obj);
        }
    }
}

