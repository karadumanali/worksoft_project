using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WorksoftTaskTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLastLoginDateToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginDate",
                table: "Users",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLoginDate",
                table: "Users");
        }
    }
}
