# 5. Design
## 5.c.i Interactions Design - Use Cases




@startuml
!theme plain
left to right direction

' Actors
actor Player as player
actor Admin as admin

' System boundary
rectangle "Cat Walk System" {
  
  ' Player Authentication
  (Login) as login
  (Logout) as logout
  
  ' Admin Authentication
  (Admin Login) as adminLogin
  (Admin Logout) as adminLogout
  
  ' Cat Management
  (View Cat Album) as album
  (Adopt Cat) as adopt
  (Edit Cat) as edit
  (Delete Cat) as delete
  
  ' Fashion Shows
  (Enter Fashion Show) as enter
  (Vote in Show) as vote
  
  ' Shopping & Customization
  (Browse Items) as browse
  (Purchase Item) as purchase
  (Equip Item) as equip
  (Unequip Item) as unequip
  
  ' Communication
  (Send Message) as send
  (Read Communications) as read

  ' Admin Functions
  (Manage Content) as manageContent
  (Send Broadcast) as sendBroadcast
  (Handle Support Cases) as handleSupport
  (View Player Accounts) as viewPlayers
  
  ' Internal Processes
  (Classify Photo) as classify
  (Validate Template) as validate
}

' Player connections
player --> login
player --> logout
player --> album
player --> enter
player --> browse
player --> send
player --> read

' Admin connections
admin --> adminLogin
admin --> adminLogout
admin --> manageContent
admin --> sendBroadcast
admin --> handleSupport
admin --> viewPlayers

' Include relationships (essential/required)
adopt ..> classify : <<include>>
edit ..> classify : <<include>>
classify ..> validate : <<include>>
enter ..> vote : <<include>>
browse ..> equip : <<include>>
browse ..> unequip : <<include>>

' Extend relationships (optional/accessible from)
album ..> adopt : <<extend>>
album ..> edit : <<extend>>
album ..> delete : <<extend>>
browse ..> purchase : <<extend>>

@enduml