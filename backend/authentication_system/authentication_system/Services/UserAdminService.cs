// Services/UserAdminService.cs
using authentication_system.Data;
using authentication_system.Entities;
using authentication_system.Helpers;
using authentication_system.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace authentication_system.Services;

public class UserAdminService(UserDbContext db) : IUserAdminService
{
    public async Task<(UserResponseDTO?, string?, string?)> CreateAsync(UserCreateDTO dto)
    {
        var email = $"{dto.FirstName.ToLower()}.{dto.LastName.ToLower()}@etu.uae.ac.ma";

        if (await db.Users.AnyAsync(u => u.Email == email))
            return (null, null, "Un utilisateur avec cet email existe d�j�.");

        var role = await db.Roles.FirstOrDefaultAsync(r => r.Name == dto.RoleName);
        if (role == null) return (null, null, $"R�le '{dto.RoleName}' introuvable.");

        var rawPassword = PasswordHelper.GenerateSecurePassword();

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = email,
            CreatedAt = DateTime.UtcNow,
            PasswordHash = new PasswordHasher<User>().HashPassword(null!, rawPassword)
        };

        db.Users.Add(user);
        db.UserRoles.Add(new UserRole { Id = Guid.NewGuid(), UserId = user.Id, RoleId = role.Id });

        await db.SaveChangesAsync();

        return (ToDto(user, role.Name), rawPassword, null);
    }

    public async Task<IEnumerable<UserResponseDTO>> GetAllAsync() =>
        await db.Users
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .Select(u => ToDto(u, u.UserRoles.Select(ur => ur.Role.Name).FirstOrDefault() ?? ""))
            .ToListAsync();

    public async Task<UserResponseDTO?> GetAsync(Guid id)
    {
        var user = await db.Users
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == id);

        return user == null
            ? null
            : ToDto(user, user.UserRoles.Select(ur => ur.Role.Name).FirstOrDefault() ?? "");
    }

    public async Task<(bool, string?)> UpdateAsync(Guid id, UserUpdateDTO dto)
    {
        var user = await db.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return (false, "Utilisateur introuvable.");

        var newRole = await db.Roles.FirstOrDefaultAsync(r => r.Name == dto.RoleName);
        if (newRole == null) return (false, "R�le invalide.");

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.IsActive = dto.IsActive;

        // r�le�: on remplace le premier r�le existant
        var rel = user.UserRoles.FirstOrDefault();
        if (rel != null && rel.RoleId != newRole.Id)
            rel.RoleId = newRole.Id;

        await db.SaveChangesAsync();
        return (true, null);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await db.Users.FindAsync(id);
        if (user == null) return false;
        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return true;
    }

    private static UserResponseDTO ToDto(User u, string role) => new()
    {
        Id = u.Id,
        FirstName = u.FirstName,
        LastName = u.LastName,
        Email = u.Email,
        IsActive = u.IsActive,
        Role = role
    };
}
