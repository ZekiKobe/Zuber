# Zuber - Uber-like Ride-Hailing App

Zuber is a Flutter-based ride-hailing application similar to Uber, designed for customers to request and manage rides. This project demonstrates a complete ride-hailing solution with real-time tracking, authentication, and ride management.

## Features

- Customer authentication and profile management
- Real-time location tracking with Google Maps
- Ride request and management system
- Profile management
- Ride history

## Tech Stack

### Frontend (Flutter)
- **Flutter** - Cross-platform mobile development framework
- **Dart** - Programming language
- **Provider** - State management
- **Google Maps Flutter** - Map integration
- **Socket.IO Client** - Real-time communication
- **HTTP** - API communication

### Backend (Node.js)
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication

## Project Structure

```
lib/
├── main.dart                 # Entry point
├── models/                   # Data models
│   ├── user.dart
│
│   ├── ride.dart
│   ├── vehicle.dart
│   └── payment.dart
├── screens/                  # UI screens
│   ├── login_screen.dart
│   ├── register_screen.dart
│   ├── user_home_screen.dart
│
├── services/                 # API and socket services
│   ├── api_service.dart
│   └── socket_service.dart
├── providers/                # State management
│   ├── auth_provider.dart
│   └── ride_provider.dart
├── widgets/                  # Custom widgets
│   ├── custom_text_field.dart
│   └── custom_button.dart
└── utils/                    # Utility functions
    └── constants.dart
```

## Screenshots

### User Interface
- Login/Registration screen
- Map view with pickup and destination selection
- Ride request interface



## Setup Instructions

### Prerequisites
- Flutter SDK
- Dart SDK
- Android Studio or VS Code
- MySQL database
- Node.js backend (separate repository)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd zuber_app
   ```

3. Install dependencies:
   ```
   flutter pub get
   ```

4. Configure environment variables:
   - Update API base URL in `lib/services/api_service.dart`
   - Configure Google Maps API key in `android/app/src/main/AndroidManifest.xml`

5. Run the app:
   ```
   flutter run
   ```

## Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8
  http: ^1.2.2
  socket_io_client: ^2.0.2
  google_maps_flutter: ^2.9.0
  geolocator: ^13.0.1
  geocoding: ^3.0.0
  provider: ^6.1.2
  flutter_svg: ^2.0.10+1
```

## API Endpoints

The app communicates with a Node.js backend through the following endpoints:

### Authentication
- `POST /api/auth/register/user` - Register a new user
- `POST /api/auth/login/user` - User login

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile



### Ride Management
- `POST /api/rides/request` - Request a new ride
- `GET /api/rides/:id` - Get ride details
- `PUT /api/rides/:id/cancel` - Cancel a ride


## Real-time Events

The app uses Socket.IO for real-time communication:

- `user-connect` - User establishes connection
- `user-connect` - User establishes connection
- `request-ride` - User requests a ride
- `location-update` - Send location updates
- `ride-status-update` - Update ride status

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a pull request

## License

This project is licensed under the MIT License.

## Acknowledgements

- Inspired by Uber's design and functionality
- Built with Flutter and Node.js