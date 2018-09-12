using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMachine.Migrations
{
    public partial class EditCuttingPlan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Weight",
                table: "TaskMachine",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Weight",
                table: "CuttingPlan",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Weight",
                table: "TaskMachine");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "CuttingPlan");
        }
    }
}
