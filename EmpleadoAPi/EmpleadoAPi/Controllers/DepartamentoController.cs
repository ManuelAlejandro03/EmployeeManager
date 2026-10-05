using EmpleadoAPi.Data;
using EmpleadoAPi.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmpleadoAPi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DepartamentoController : ControllerBase
    {
        private readonly EmpleadoDBContext _context;

        public DepartamentoController(EmpleadoDBContext context) 
        {

            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetAll() 
        {
            var departamentos = await _context.Departamentos.
                AsNoTracking().
                Select(e => new GetDepartamentoResponse(e.
                DepartamentoId, e.
                Nombre)).
                ToListAsync();
            return Ok(departamentos);
        }
    }
}