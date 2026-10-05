using EmpleadoAPi.Data;
using EmpleadoAPi.DTO;
using EmpleadoAPi.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

namespace EmpleadoAPi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmpleadoController : ControllerBase
    {
        private readonly EmpleadoDBContext _context;
        private readonly IWebHostEnvironment _env;
        public EmpleadoController(EmpleadoDBContext context, IWebHostEnvironment env) 
        {
            _context = context;
            _env = env;
        }


        private async Task<string> SaveImageAsync(IFormFile imageFile) 
        {
            string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            string uploadsFolder = Path.Combine(_env.WebRootPath, "images");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);
            using (var filesStream = new FileStream(filePath, FileMode.Create)) 
            {
                await imageFile.CopyToAsync(filesStream);
            }
            return uniqueFileName;

        }

        private void DeleteImage(string? fileName) 
        {
            if (string.IsNullOrEmpty(fileName)) return;
            string filePath = Path.Combine(_env.WebRootPath, "images", fileName);
            if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);

        }

        [HttpGet]
        public async Task<IActionResult> getAll()
        {
            string baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";

            var empleados = await _context.Empleados.AsNoTracking()
                .Select(e => new GetEmpleadoResponse(
                    e.EmpleadoId,
                    e.NombreCompleto,
                    e.Email,
                    e.Salario,
                    string.IsNullOrEmpty(e.Image) ? $"{baseUrl}/images/default.png" : $"{baseUrl}/images/{e.Image}",
                    e.Departamento.Nombre,
                    e.Departamento.DepartamentoId
                    )).ToListAsync();
            return Ok(empleados);
        }

        [HttpGet]
        public async Task<IActionResult> getById(int id)
        {
            string baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";

            var empleados = await _context.Empleados.AsNoTracking()
                .Include(d => d.DepartamentoId)
                .Where(e => e.EmpleadoId == id)
                .Select(e => new GetEmpleadoResponse(
                    e.EmpleadoId,
                    e.NombreCompleto,
                    e.Email,
                    e.Salario,
                    "",
                    e.Departamento.Nombre,
                    e.Departamento.DepartamentoId
                    )).FirstOrDefaultAsync();
            return Ok(empleados);
        }
        [HttpPost]
        public async Task<IActionResult> create([FromForm]CreateEmpleadoRequest req)
        {
            string fileName = await SaveImageAsync(req.imagen);

            var empleado = new Empleado
            {
                NombreCompleto = req.nombreCompleto,
                Email = req.correo,
                Salario = req.salario,
                Image = req.nombreCompleto,
                DepartamentoId = req.departamentoID
            };

            await _context.Empleados.AddAsync(empleado);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Empleado ha sido creado satisfactoriamente." });
        }

        [HttpPut]
        public async Task<IActionResult> actualizar([FromForm] UpdateEmpleadoRequest req)
        {
            var empleado = await _context.Empleados.FindAsync(req.id);
            string fileName = await SaveImageAsync(req.imagen);

            empleado!.NombreCompleto = req.nombreCompleto;
            empleado!.Email = req.correo;
            empleado!.Salario = req.salario;
            empleado!.DepartamentoId = req.depatramentoID;

            if (req.imagen != null)
            {
                DeleteImage(empleado.Image);
                empleado.Image = await SaveImageAsync(req.imagen);
            }
            _context.Empleados.Update(empleado);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Empleado modificado satisfactoriamente." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> eliminar(int id)
        {
            var empleado = await _context.Empleados.FindAsync(id);


            if (empleado!.Image != null) DeleteImage(empleado.Image);
            
            _context.Empleados.Remove(empleado);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Empleado eliminado satisfactoriamente." });
        }
    }
}
