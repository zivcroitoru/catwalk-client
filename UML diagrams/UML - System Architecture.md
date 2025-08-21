@startuml
!theme plain
title Cat Walk System Architecture

' ═══════════════════════════════════════════════════════════════════════════
' ACTORS
' ═══════════════════════════════════════════════════════════════════════════
actor User
actor Admin

' ═══════════════════════════════════════════════════════════════════════════
' FRONTEND
' ═══════════════════════════════════════════════════════════════════════════
package "Frontend (React/Vite)" as Frontend #LightBlue {
    [Web Interface] as WebUI
    [Admin Interface] as AdminUI
}

' ═══════════════════════════════════════════════════════════════════════════
' BACKEND
' ═══════════════════════════════════════════════════════════════════════════
package "Backend (Node.js/Express)" as Backend #LightGreen {
    [REST API] as API
    [WebSocket Server] as WS
    [JWT Authentication] as Auth
}

' ═══════════════════════════════════════════════════════════════════════════
' DATABASE
' ═══════════════════════════════════════════════════════════════════════════
database "PostgreSQL (Neon DB)" as DB #LightYellow {
    [players] as Players
    [cats] as Cats
    [cat_items] as Items
    [player_cats] as PlayerCats
    [messages] as Messages
}

' ═══════════════════════════════════════════════════════════════════════════
' EXTERNAL SERVICES
' ═══════════════════════════════════════════════════════════════════════════
cloud "External APIs" as External #LightPink {
    [Cat Facts API] as CatAPI
}

' ═══════════════════════════════════════════════════════════════════════════
' CONNECTIONS
' ═══════════════════════════════════════════════════════════════════════════

' User interactions
User --> WebUI : plays game
Admin --> AdminUI : manages system

' Frontend to Backend
WebUI --> API : HTTP/REST
WebUI --> WS : WebSocket
AdminUI --> API : HTTP/REST
AdminUI --> Auth : login/register

' Backend to Database
API --> Players : CRUD operations
API --> Cats : CRUD operations
API --> Items : CRUD operations
API --> PlayerCats : CRUD operations
WS --> Messages : real-time chat
Auth --> Players : user verification

' External API
API --> CatAPI : fetch cat facts

' ═══════════════════════════════════════════════════════════════════════════
' ANNOTATIONS
' ═══════════════════════════════════════════════════════════════════════════

note right of API
  <b>REST Endpoints:</b>
  • GET/POST /cats
  • GET/POST /items  
  • GET/POST /players
  • PUT/DELETE operations
  
  <b>Technologies:</b>
  • Node.js + Express
  • JWT tokens
  • CORS middleware
end note

note right of WebUI
  <b>Technologies:</b>
  • React 18
  • Vite (bundler)
  • Socket.io client
  • HTTP client (Axios/Fetch)
end note

note bottom of DB
  <b>Key Operations:</b>
  • Player registration & management
  • Cat breeding & ownership
  • Item inventory & shop
  • Real-time messaging
  
  <b>Database:</b>
  • PostgreSQL hosted on Neon
  • Connection pooling
  • SQL queries (SELECT, INSERT, UPDATE, DELETE)
end note

@enduml