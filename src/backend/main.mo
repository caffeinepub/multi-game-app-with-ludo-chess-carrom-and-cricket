import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type GameStats = {
    gamesPlayed : Nat;
    wins : Nat;
    losses : Nat;
    bestScore : Nat;
  };

  public type UserGameStats = {
    gameMode1 : GameStats;
    gameMode2 : GameStats;
    gameMode3 : GameStats;
    gameMode4 : GameStats;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userStats = Map.empty<Principal, UserGameStats>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Game Statistics Management
  public query ({ caller }) func getMyStats() : async ?UserGameStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to view stats");
    };
    userStats.get(caller);
  };

  public shared ({ caller }) func updateMyStats(newStats : UserGameStats) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to update stats");
    };
    userStats.add(caller, newStats);
  };

  public query ({ caller }) func getUserStats(user : Principal) : async ?UserGameStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be a user to view stats");
    };
    userStats.get(user);
  };
};
