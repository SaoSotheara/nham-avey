import { UseGuards } from "@nestjs/common"
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { DecodedIdToken } from "firebase-admin/auth"
import { GraphqlAuthGuard } from "src/auth/graphql-auth-guard.service"
import { GraphqlAuthUser } from "src/auth/graphql-auth-user.decorator"
import { Roles } from "src/auth/role.decorator"
import { User, UserRole } from "src/users/entities/user.entity"
import { UpdateProfileInput, UpdateProfileOutput } from "src/users/users.dto"
import { UserService } from "src/users/users.service"

@Resolver()
export class CommonUsersResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User)
  @UseGuards(GraphqlAuthGuard)
  @Roles(UserRole.Admin, UserRole.Vendor, UserRole.Driver, UserRole.Customer)
  getMe(@GraphqlAuthUser() authUser: DecodedIdToken): Promise<User | null> {
    return this.userService.findUserById(authUser.uid)
  }

  @Roles(UserRole.Admin, UserRole.Vendor, UserRole.Driver, UserRole.Customer)
  @Mutation(returns => UpdateProfileOutput)
  updateMe(@GraphqlAuthUser() authUser: User, @Args("input") input: UpdateProfileInput): Promise<UpdateProfileOutput> {
    return this.userService.updateProfile(authUser.id, input)
  }
}
