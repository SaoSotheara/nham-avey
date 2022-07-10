import { ArgsType, Field, ObjectType } from "@nestjs/graphql"
import { CoreOutput } from "src/common/dtos/output.dto"
import { User } from "src/users/entities/user.entity"

@ArgsType()
export class UserProfileInput {
  @Field(type => Number)
  userId: string
}

@ObjectType()
export class UserProfileOutput extends CoreOutput {
  @Field(type => User, { nullable: true })
  user?: User
}
