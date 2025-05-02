// Services/AccountService.cs

using authentication_system.Data;
using authentication_system.Entities;
using authentication_system.Helpers;
using authentication_system.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace authentication_system.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserDbContext context;

        public AccountService(UserDbContext context)
        {
            this.context = context;
        }

        public async Task<ChangePasswordResult> ChangePasswordAsync(Guid userId, ChangePasswordDTO dto)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return new ChangePasswordResult
                {
                    Success = false,
                    Message = "Utilisateur introuvable."
                };
            }

            var hasher = new PasswordHasher<User>();

            if (hasher.VerifyHashedPassword(user, user.PasswordHash, dto.CurrentPassword)
                == PasswordVerificationResult.Failed)
            {
                return new ChangePasswordResult
                {
                    Success = false,
                    Message = "Mot de passe actuel incorrect."
                };
            }

            if (dto.NewPassword != dto.ConfirmPassword)
            {
                return new ChangePasswordResult
                {
                    Success = false,
                    Message = "Les nouveaux mots de passe ne correspondent pas."
                };
            }

            if (!PasswordValidator.IsStrongPassword(dto.NewPassword, out var validationError))
            {
                return new ChangePasswordResult
                {
                    Success = false,
                    Message = validationError
                };
            }

            user.PasswordHash = hasher.HashPassword(user, dto.NewPassword);
            await context.SaveChangesAsync();

            return new ChangePasswordResult
            {
                Success = true,
                Message = "Mot de passe mis � jour avec succ�s."
            };
        }
    }
}
