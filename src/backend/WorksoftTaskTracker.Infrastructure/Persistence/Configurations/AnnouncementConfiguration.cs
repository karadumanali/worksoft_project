using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WorksoftTaskTracker.Domain.Entities;

namespace WorksoftTaskTracker.Infrastructure.Persistence.Configurations;

public class AnnouncementConfiguration : IEntityTypeConfiguration<Announcement>
{
    public void Configure(EntityTypeBuilder<Announcement> builder)
    {
        builder.ToTable("Announcements");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.Content)
            .IsRequired()
            .HasMaxLength(2000);

        builder.Property(a => a.IsActive)
            .HasDefaultValue(true);

        builder.Property(a => a.PublishDate)
            .HasDefaultValueSql("GETUTCDATE()");

        builder.HasOne(a => a.CreatedByUser)
            .WithMany(u => u.CreatedAnnouncements)
            .HasForeignKey(a => a.CreatedBy)
            .OnDelete(DeleteBehavior.Restrict);
    }
}