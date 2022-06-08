import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql"
import { AuthUser } from "auth/auth-user.decorator"
import { Role } from "auth/role.decorator"
import { AllCategoriesOutput } from "restaurants/dtos/all-categories.dto"
import { CategoryInput, CategoryOutput } from "restaurants/dtos/category.dto"
import { CreateDishInput, CreateDishOutput } from "restaurants/dtos/create-dish.dto"
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "restaurants/dtos/create-restaurant.dto"
import { DeleteDishInput, DeleteDishOutput } from "restaurants/dtos/delete-dish.dto"
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from "restaurants/dtos/delete-restaurant.dto"
import { EditDishInput, EditDishOutput } from "restaurants/dtos/edit-dish.dto"
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from "restaurants/dtos/edit.restaurant.dto"
import { MyRestaurantInput, MyRestaurantOutput } from "restaurants/dtos/my-restaurant"
import { MyRestaurantsOutput } from "restaurants/dtos/my-restaurants.dto"
import { RestaurantInput, RestaurantOutput } from "restaurants/dtos/restaurant.dto"
import { RestaurantsInput, RestaurantsOutput } from "restaurants/dtos/restaurants.dto"
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from "restaurants/dtos/search-restaurant.dto"
import { Category } from "restaurants/entities/category.entity"
import { Dish } from "restaurants/entities/dish.entity"
import { Restaurant } from "restaurants/entities/restaurant.entity"
import { RestaurantService } from "restaurants/restaurants.service"
import { UserRole, User } from "users/entities/user.entity"

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(() => CreateRestaurantOutput)
  @Role([UserRole.Owner])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args("input") createRestaurantInput: CreateRestaurantInput
  ): Promise<CreateRestaurantOutput> {
    return await this.restaurantService.createRestaurant(authUser, createRestaurantInput)
  }

  @Query(() => MyRestaurantsOutput)
  @Role([UserRole.Owner])
  myRestaurants(@AuthUser() owner: User): Promise<MyRestaurantsOutput> {
    return this.restaurantService.myRestaurants(owner)
  }

  @Query(() => MyRestaurantOutput)
  @Role([UserRole.Owner])
  myRestaurant(
    @AuthUser() owner: User,
    @Args("input") myRestaurantInput: MyRestaurantInput
  ): Promise<MyRestaurantOutput> {
    return this.restaurantService.myRestaurant(owner, myRestaurantInput)
  }

  @Mutation(() => EditRestaurantOutput)
  @Role([UserRole.Owner])
  editRestaurant(
    @AuthUser() owner: User,
    @Args("input") editRestaurantInput: EditRestaurantInput
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(owner, editRestaurantInput)
  }

  @Mutation(() => DeleteRestaurantOutput)
  @Role([UserRole.Owner])
  deleteRestaurant(
    @AuthUser() owner: User,
    @Args("input") deleteRestaurantInput: DeleteRestaurantInput
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(owner, deleteRestaurantInput)
  }

  @Query(() => RestaurantsOutput)
  restaurants(
    @Args("input") RestaurantsInput: RestaurantsInput
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.allRestaurants(RestaurantsInput)
  }

  @Query(() => RestaurantOutput)
  restaurant(@Args("input") RestaurantInput: RestaurantInput): Promise<RestaurantOutput> {
    return this.restaurantService.findRestaurantById(RestaurantInput)
  }

  @Query(() => SearchRestaurantOutput)
  searchRestaurant(
    @Args("input") searchRestaurantInput: SearchRestaurantInput
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantService.searchRestaurantByName(searchRestaurantInput)
  }
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ResolveField(() => Int)
  restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantService.countRestaurants(category)
  }

  @Query(() => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantService.allCategories()
  }

  @Query(() => CategoryOutput)
  category(@Args("input") categoryInput: CategoryInput): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput)
  }
}

@Resolver(() => Dish)
export class DishResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(() => CreateDishOutput)
  @Role([UserRole.Owner])
  createDish(
    @AuthUser() owner: User,
    @Args("input") createDishInput: CreateDishInput
  ): Promise<CreateDishOutput> {
    return this.restaurantService.createDish(owner, createDishInput)
  }

  @Mutation(() => EditDishOutput)
  @Role([UserRole.Owner])
  editDish(
    @AuthUser() owner: User,
    @Args("input") editDishInput: EditDishInput
  ): Promise<EditDishOutput> {
    return this.restaurantService.editDish(owner, editDishInput)
  }

  @Mutation(() => DeleteDishOutput)
  @Role([UserRole.Owner])
  deleteDish(
    @AuthUser() owner: User,
    @Args("input") deleteDishInput: DeleteDishInput
  ): Promise<EditDishOutput> {
    return this.restaurantService.deleteDish(owner, deleteDishInput)
  }
}