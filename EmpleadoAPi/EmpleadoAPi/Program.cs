using EmpleadoAPi.Data;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<EmpleadoDBContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("ConexionSql")));
builder.Services.AddCors(opts => 
{
    opts.AddPolicy("mypolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
        .AllowAnyHeader().AllowAnyMethod();
    });
});
var app = builder.Build();

app.UseStaticFiles();

app.UseCors("mypolicy");

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

app.Run();
