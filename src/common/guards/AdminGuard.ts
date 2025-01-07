import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException("Ruxsatnoma yo'q");
    }

    const token = authHeader.split(' ')[1]; // Bearer token formatini olish

    try {
      const decoded = this.jwtService.verify(token);
      if (decoded.isAdmin) {
        return true; // Agar admin bo'lsa, ruxsat beriladi
      }
    } catch (error) {
      console.log(error);

      throw new ForbiddenException("Noto'g'ri token");
    }

    throw new ForbiddenException("Sizda admin ruxsatnomasi yo'q!");
  }
}
