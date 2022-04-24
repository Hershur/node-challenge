import { Query, Resolver } from 'type-graphql';

@Resolver()
export class HelloWordResolver {
  @Query(() => String)
  hello() {
    return 'hi!';
  }
}
