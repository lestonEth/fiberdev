import { VirtualFile } from "../types";

export const defaultFiles: VirtualFile[] = [
  {
    path: "cmd/main.go",
    name: "main.go",
    language: "go",
    content: `package main

import (
    "log"
    "os"
    "fiber-app/internal/api"
    "fiber-app/pkg/db"

    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/logger"
    "github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
    // Initialize Database
    database := db.InitDB()
    defer database.Close()

    app := fiber.New(fiber.Config{
        AppName: "FiberDev Microservice v1.2",
    })

    // Middleware
    app.Use(logger.New())
    app.Use(cors.New())

    // Base route
    app.Get("/", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{
            "status": "online",
            "message": "Welcome to FiberDev high-performance blockchain node api",
            "version": "1.2.0",
        })
    })

    // API Routes Group
    v1 := app.Group("/api/v1")
    
    // Posts routes
    v1.Post("/posts", api.CreatePost)
    v1.Get("/posts", api.GetPosts)
    v1.Get("/posts/:id", api.GetPostByID)

    // User routes
    v1.Post("/users", api.CreateUser)
    v1.Get("/users/:id", api.GetUserByID)

    // Run Server
    port := os.Getenv("PORT")
    if port == "" {
        port = "3000"
    }

    log.Printf("Starting Fiber server on port %s", port)
    if err := app.Listen(":" + port); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}`
  },
  {
    path: "internal/api/post.go",
    name: "post.go",
    language: "go",
    content: `package api

import (
    "net/http"
    "strconv"
    "fiber-app/internal/models"
    "fiber-app/pkg/db"

    "github.com/gofiber/fiber/v2"
)

// CreatePost handles POST /api/v1/posts
func CreatePost(c *fiber.Ctx) error {
    post := new(models.Post)

    // Parse request body
    if err := c.BodyParser(post); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Cannot parse JSON payload",
        })
    }

    // Simple validation
    if post.Title == "" || post.Content == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Title and Content are required fields",
        })
    }

    // Save to simulated database
    db.SavePost(post)

    return c.Status(fiber.StatusCreated).JSON(post)
}

// GetPosts handles GET /api/v1/posts
func GetPosts(c *fiber.Ctx) error {
    posts := db.GetAllPosts()
    return c.JSON(posts)
}

// GetPostByID handles GET /api/v1/posts/:id
func GetPostByID(c *fiber.Ctx) error {
    id, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Invalid post ID format",
        })
    }

    post, found := db.GetPostByID(id)
    if !found {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": "Post not found in database",
        })
    }

    return c.JSON(post)
}`
  },
  {
    path: "internal/api/user.go",
    name: "user.go",
    language: "go",
    content: `package api

import (
    "fiber-app/internal/models"
    "fiber-app/pkg/db"

    "github.com/gofiber/fiber/v2"
)

// CreateUser handles POST /api/v1/users
func CreateUser(c *fiber.Ctx) error {
    user := new(models.User)

    if err := c.BodyParser(user); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Cannot parse JSON",
        })
    }

    if user.Username == "" || user.Email == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Username and Email are required",
        })
    }

    db.SaveUser(user)
    return c.Status(fiber.StatusCreated).JSON(user)
}

// GetUserByID handles GET /api/v1/users/:id
func GetUserByID(c *fiber.Ctx) error {
    id := c.Params("id")
    user, found := db.GetUserByUsername(id)
    if !found {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "error": "User not found",
        })
    }

    return c.JSON(user)
}`
  },
  {
    path: "internal/models/post.go",
    name: "post.go",
    language: "go",
    content: `package models

import "time"

// Post represents a blog post model
type Post struct {
    ID        int       \`json:"id"\`
    Title     string    \`json:"title"\`
    Content   string    \`json:"content"\`
    AuthorID  int       \`json:"author_id"\`
    CreatedAt time.Time \`json:"created_at"\`
}`
  },
  {
    path: "internal/models/user.go",
    name: "user.go",
    language: "go",
    content: `package models

// User represents a system user model
type User struct {
    ID       int    \`json:"id"\`
    Username string \`json:"username"\`
    Email    string \`json:"email"\`
    Role     string \`json:"role"\`
}`
  },
  {
    path: "pkg/db/db.go",
    name: "db.go",
    language: "go",
    content: `package db

import (
    "log"
    "sync"
    "time"
    "fiber-app/internal/models"
)

type Database struct {
    mu    sync.RWMutex
    posts map[int]*models.Post
    users map[string]*models.User
}

var (
    instance *Database
    once     sync.Once
)

// InitDB initializes a singleton mock database
func InitDB() *Database {
    once.Do(func() {
        instance = &Database{
            posts: make(map[int]*models.Post),
            users: make(map[string]*models.User),
        }
        
        // Seed some data
        instance.posts[1] = &models.Post{
            ID:        1,
            Title:     "Building ultra high performance APIs",
            Content:   "Go and Fiber represent an exceptional combination for speed and lightweight memory foot print...",
            AuthorID:  101,
            CreatedAt: time.Now().Add(-2 * time.Hour),
        }
        
        instance.users["johndoe"] = &models.User{
            ID:       101,
            Username: "johndoe",
            Email:    "john@fiberdev.io",
            Role:     "Core Developer",
        }
        
        log.Println("Database connection established successfully")
    })
    return instance
}

func (db *Database) Close() {
    log.Println("Database connection closed cleanly")
}

func SavePost(post *models.Post) {
    instance.mu.Lock()
    defer instance.mu.Unlock()
    
    post.ID = len(instance.posts) + 1
    post.CreatedAt = time.Now()
    instance.posts[post.ID] = post
}

func GetAllPosts() []*models.Post {
    instance.mu.RLock()
    defer instance.mu.RUnlock()
    
    var list []*models.Post
    for _, p := range instance.posts {
        list = append(list, p)
    }
    return list
}

func GetPostByID(id int) (*models.Post, bool) {
    instance.mu.RLock()
    defer instance.mu.RUnlock()
    
    post, found := instance.posts[id]
    return post, found
}

func SaveUser(user *models.User) {
    instance.mu.Lock()
    defer instance.mu.Unlock()
    
    user.ID = len(instance.users) + 1
    instance.users[user.Username] = user
}

func GetUserByUsername(username string) (*models.User, bool) {
    instance.mu.RLock()
    defer instance.mu.RUnlock()
    
    user, found := instance.users[username]
    return user, found
}`
  },
  {
    path: "go.mod",
    name: "go.mod",
    language: "makefile",
    content: `module fiber-app

go 1.22

require (
	github.com/gofiber/fiber/v2 v2.52.2
	github.com/google/uuid v1.6.0
)`
  },
  {
    path: "go.sum",
    name: "go.sum",
    language: "makefile",
    content: `github.com/gofiber/fiber/v2 v2.52.2 h1:7y139H156XyC/80f7PZ6S...
github.com/google/uuid v1.6.0 h1:NI9v...`
  },
  {
    path: "README.md",
    name: "README.md",
    language: "markdown",
    content: `# FiberDev Blockchain API Service

A professional, high-performance Go microservice running on top of **Fiber v2** and custom high-speed blockchain network layers.

## Features
- **Express-level simplicity** with native Go concurrency.
- **Embedded virtual in-memory store** utilizing thread-safe maps and read-write locks (\`sync.RWMutex\`).
- **Fully containerized pipeline** ready to deploy onto FiberDev testnets or mainnets in 1 click.

## API Endpoints
- \`GET /\` - Health check & server status.
- \`POST /api/v1/posts\` - Create post.
- \`GET /api/v1/posts\` - Retrieve all posts.
- \`GET /api/v1/posts/:id\` - Find post by ID.`
  }
];
