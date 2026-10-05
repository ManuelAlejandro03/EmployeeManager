namespace EmpleadoAPi.DTO
{
    public record CreateEmpleadoRequest(string nombreCompleto, string correo, decimal salario, IFormFile imagen, int departamentoID);
    public record UpdateEmpleadoRequest(int id, string nombreCompleto, string correo, decimal salario, IFormFile? imagen, int depatramentoID);
    public record GetEmpleadoResponse(int id, string nombreCompleto, string correo, decimal salario, string imagenUrl, string nombreDepartamento, int departamentoId);
}