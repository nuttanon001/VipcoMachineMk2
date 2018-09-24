using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMachine.Migrations
{
    public partial class AddWeightToJobMaster : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Weight",
                table: "JobCardMaster",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Weight",
                table: "JobCardMaster");
        }
    }
}
