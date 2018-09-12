using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMachine.Migrations
{
    public partial class UpdateJobCard : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HasOverTime",
                table: "TaskMachine",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TaskDueDate",
                table: "TaskMachine",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SplitFormJobCardId",
                table: "JobCardDetail",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasOverTime",
                table: "TaskMachine");

            migrationBuilder.DropColumn(
                name: "TaskDueDate",
                table: "TaskMachine");

            migrationBuilder.DropColumn(
                name: "SplitFormJobCardId",
                table: "JobCardDetail");
        }
    }
}
