import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as jwtUtils from'../../../utils/jwt.util';
import { UserService } from '../../user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtUtils.DEFAULT_JWT_SECRET_STRING,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findUserById(payload.id);
       return {
          id: user.id,
          name: user.name,
          email: user.email,
       };
  }
}