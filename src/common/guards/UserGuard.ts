import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Authorization headeri yo'qligini tekshirish
    if (!authHeader) {
      throw new UnauthorizedException('Authorization headeri mavjud emas');
    }

    // Bearer va tokenni ajratish
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    // Agar Bearer to'g'ri bo'lmasa yoki token bo'lmasa
    if (bearer !== 'Bearer' || !token)
      throw new UnauthorizedException('Token mavjud emas');

    try {
      // Tokenni tekshirish
      const user = this.jwtService.verify(token);
      // Foydalanuvchi ma'lumotlarini so'rovga qo'shish
      request.user = user;
      return true; // So'rovni davom ettirishga ruxsat berish
    } catch (error) {
      console.error('Tokenni tekshirishda xato:', error); // Xatoni log qilish

      // Agar xato tokenning muddati o'tgan bo'lsa
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException("Tokenning muddati o'tgan");
      }
      // Boshqa xatolar uchun
      throw new UnauthorizedException('Noto‘g‘ri token');
    }
  }
}
