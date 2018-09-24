using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMachine.Migrations
{
    public partial class updateTaskMachine : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReceiveBy",
                table: "TaskMachine",
                maxLength: 200,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReceiveBy",
                table: "TaskMachine");
        }
    }
}
