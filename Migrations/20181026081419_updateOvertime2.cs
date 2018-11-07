using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMachine.Migrations
{
    public partial class updateOvertime2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BomCode",
                table: "OverTimeMaster",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TypeCode",
                table: "OverTimeMaster",
                maxLength: 20,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BomCode",
                table: "OverTimeMaster");

            migrationBuilder.DropColumn(
                name: "TypeCode",
                table: "OverTimeMaster");
        }
    }
}
