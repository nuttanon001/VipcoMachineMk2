using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace VipcoMachine.Migrations
{
    public partial class updateMachine1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StandardTimeId",
                table: "TaskMachine",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProgressTaskMachine",
                columns: table => new
                {
                    Creator = table.Column<string>(nullable: true),
                    CreateDate = table.Column<DateTime>(nullable: true),
                    Modifyer = table.Column<string>(nullable: true),
                    ModifyDate = table.Column<DateTime>(nullable: true),
                    ProgressId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Quantity = table.Column<double>(nullable: true),
                    Weight = table.Column<double>(nullable: true),
                    ProgressDate = table.Column<DateTime>(nullable: true),
                    ProgressTaskMachineStatus = table.Column<int>(nullable: true),
                    TaskMachineId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgressTaskMachine", x => x.ProgressId);
                    table.ForeignKey(
                        name: "FK_ProgressTaskMachine_TaskMachine_TaskMachineId",
                        column: x => x.TaskMachineId,
                        principalTable: "TaskMachine",
                        principalColumn: "TaskMachineId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TaskMachine_StandardTimeId",
                table: "TaskMachine",
                column: "StandardTimeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProgressTaskMachine_TaskMachineId",
                table: "ProgressTaskMachine",
                column: "TaskMachineId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskMachine_StandardTime_StandardTimeId",
                table: "TaskMachine",
                column: "StandardTimeId",
                principalTable: "StandardTime",
                principalColumn: "StandardTimeId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskMachine_StandardTime_StandardTimeId",
                table: "TaskMachine");

            migrationBuilder.DropTable(
                name: "ProgressTaskMachine");

            migrationBuilder.DropIndex(
                name: "IX_TaskMachine_StandardTimeId",
                table: "TaskMachine");

            migrationBuilder.DropColumn(
                name: "StandardTimeId",
                table: "TaskMachine");
        }
    }
}
