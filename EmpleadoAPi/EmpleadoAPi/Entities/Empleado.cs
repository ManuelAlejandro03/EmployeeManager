using System;
using System.Collections.Generic;

namespace EmpleadoAPi.Entities;

public partial class Empleado
{
    public int EmpleadoId { get; set; }

    public string NombreCompleto { get; set; } = null!;

    public string Email { get; set; } = null!;

    public decimal Salario { get; set; }

    public string? Image { get; set; }

    public int DepartamentoId { get; set; }

    public virtual Departamento Departamento { get; set; } = null!;
}
