# Swift Calendar App - API Integration Guide

This document provides complete instructions for building a Swift calendar app that connects to the 8alls API.

## Table of Contents

1. [API Overview](#api-overview)
2. [Swift Data Models](#swift-data-models)
3. [Networking Layer](#networking-layer)
4. [Calendar Endpoints](#calendar-endpoints)
5. [WebSocket Integration](#websocket-integration)
6. [Sync Strategy](#sync-strategy)
7. [Error Handling](#error-handling)
8. [Example Implementation](#example-implementation)

---

## API Overview

**Base URL:** `https://8alls-api.fly.dev/api`
**WebSocket URL:** `wss://8alls-api.fly.dev/ws`
**Authentication:** None required (currently open API)
**Content-Type:** `application/json`

### Architecture

The 8alls API is a central backend that enables data synchronization across multiple platforms (iOS, Android, web, desktop). All calendar events are stored in a PostgreSQL database and changes are broadcast via WebSocket for real-time updates.

---

## Swift Data Models

Create these Codable structs to represent API data:

```swift
import Foundation

// MARK: - Calendar Event

struct CalendarEvent: Codable, Identifiable {
    let id: String
    var title: String
    var description: String?
    var startTime: Date
    var endTime: Date
    var allDay: Bool
    var location: String?
    var recurrenceRule: String?
    var status: EventStatus
    var eventType: String?
    var color: String?
    var tags: [String]?
    var attendees: [Attendee]?
    var reminders: [Reminder]?
    let createdAt: Date?
    let updatedAt: Date?

    enum CodingKeys: String, CodingKey {
        case id, title, description, location, status, color, tags, attendees, reminders
        case startTime = "start_time"
        case endTime = "end_time"
        case allDay = "all_day"
        case recurrenceRule = "recurrence_rule"
        case eventType = "event_type"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

// MARK: - Event Status

enum EventStatus: String, Codable {
    case confirmed
    case tentative
    case cancelled
}

// MARK: - Attendee

struct Attendee: Codable {
    var name: String
    var email: String
}

// MARK: - Reminder

struct Reminder: Codable {
    var minutesBefore: Int
    var method: String

    enum CodingKeys: String, CodingKey {
        case minutesBefore = "minutes_before"
        case method
    }
}

// MARK: - Event Creation Request

struct CreateEventRequest: Codable {
    var title: String
    var description: String?
    var startTime: Date
    var endTime: Date
    var allDay: Bool
    var location: String?
    var recurrenceRule: String?
    var status: EventStatus
    var eventType: String?
    var color: String?
    var tags: [String]?
    var attendees: [Attendee]?
    var reminders: [Reminder]?

    enum CodingKeys: String, CodingKey {
        case title, description, location, status, color, tags, attendees, reminders
        case startTime = "start_time"
        case endTime = "end_time"
        case allDay = "all_day"
        case recurrenceRule = "recurrence_rule"
        case eventType = "event_type"
    }
}

// MARK: - Event Update Request

struct UpdateEventRequest: Codable {
    var title: String?
    var description: String?
    var startTime: Date?
    var endTime: Date?
    var allDay: Bool?
    var location: String?
    var recurrenceRule: String?
    var status: EventStatus?
    var eventType: String?
    var color: String?
    var tags: [String]?
    var attendees: [Attendee]?
    var reminders: [Reminder]?

    enum CodingKeys: String, CodingKey {
        case title, description, location, status, color, tags, attendees, reminders
        case startTime = "start_time"
        case endTime = "end_time"
        case allDay = "all_day"
        case recurrenceRule = "recurrence_rule"
        case eventType = "event_type"
    }
}

// MARK: - API Error

struct APIError: Codable {
    let detail: String
}
```

---

## Networking Layer

Create a networking service to handle API requests:

```swift
import Foundation

class CalendarAPI {
    static let shared = CalendarAPI()

    private let baseURL = "https://8alls-api.fly.dev/api"
    private let session: URLSession

    // Date formatters for ISO 8601
    private let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .custom { date, encoder in
            var container = encoder.singleValueContainer()
            let formatter = ISO8601DateFormatter()
            formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            try container.encode(formatter.string(from: date))
        }
        return encoder
    }()

    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let dateString = try container.decode(String.self)

            let formatter = ISO8601DateFormatter()
            formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

            if let date = formatter.date(from: dateString) {
                return date
            }

            // Fallback without fractional seconds
            formatter.formatOptions = [.withInternetDateTime]
            if let date = formatter.date(from: dateString) {
                return date
            }

            throw DecodingError.dataCorruptedError(
                in: container,
                debugDescription: "Cannot decode date string \(dateString)"
            )
        }
        return decoder
    }()

    private init() {
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 60
        self.session = URLSession(configuration: configuration)
    }

    // MARK: - Helper Methods

    private func makeRequest(
        endpoint: String,
        method: String = "GET",
        body: Data? = nil,
        queryItems: [URLQueryItem]? = nil
    ) async throws -> (Data, HTTPURLResponse) {
        var urlComponents = URLComponents(string: baseURL + endpoint)!
        urlComponents.queryItems = queryItems

        guard let url = urlComponents.url else {
            throw URLError(.badURL)
        }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = body

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw URLError(.badServerResponse)
        }

        // Check for errors
        if httpResponse.statusCode >= 400 {
            if let apiError = try? decoder.decode(APIError.self, from: data) {
                throw NSError(
                    domain: "CalendarAPI",
                    code: httpResponse.statusCode,
                    userInfo: [NSLocalizedDescriptionKey: apiError.detail]
                )
            }
            throw URLError(.badServerResponse)
        }

        return (data, httpResponse)
    }
}
```

---

## Calendar Endpoints

Add these methods to your `CalendarAPI` class:

### 1. Get All Events (with filters)

```swift
extension CalendarAPI {
    func getEvents(
        startDate: Date? = nil,
        endDate: Date? = nil,
        eventType: String? = nil,
        status: EventStatus? = nil
    ) async throws -> [CalendarEvent] {
        var queryItems: [URLQueryItem] = []

        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime]

        if let startDate = startDate {
            queryItems.append(URLQueryItem(
                name: "start_date",
                value: formatter.string(from: startDate)
            ))
        }

        if let endDate = endDate {
            queryItems.append(URLQueryItem(
                name: "end_date",
                value: formatter.string(from: endDate)
            ))
        }

        if let eventType = eventType {
            queryItems.append(URLQueryItem(name: "event_type", value: eventType))
        }

        if let status = status {
            queryItems.append(URLQueryItem(name: "status", value: status.rawValue))
        }

        let (data, _) = try await makeRequest(
            endpoint: "/events",
            queryItems: queryItems.isEmpty ? nil : queryItems
        )

        return try decoder.decode([CalendarEvent].self, from: data)
    }
}
```

### 2. Get Single Event

```swift
extension CalendarAPI {
    func getEvent(id: String) async throws -> CalendarEvent {
        let (data, _) = try await makeRequest(endpoint: "/events/\(id)")
        return try decoder.decode(CalendarEvent.self, from: data)
    }
}
```

### 3. Get Events for Specific Date

```swift
extension CalendarAPI {
    func getEvents(for date: Date) async throws -> [CalendarEvent] {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let dateString = formatter.string(from: date)

        let (data, _) = try await makeRequest(endpoint: "/events/date/\(dateString)")
        return try decoder.decode([CalendarEvent].self, from: data)
    }
}
```

### 4. Create Event

```swift
extension CalendarAPI {
    func createEvent(_ request: CreateEventRequest) async throws -> CalendarEvent {
        let body = try encoder.encode(request)
        let (data, _) = try await makeRequest(
            endpoint: "/events",
            method: "POST",
            body: body
        )
        return try decoder.decode(CalendarEvent.self, from: data)
    }
}
```

### 5. Update Event

```swift
extension CalendarAPI {
    func updateEvent(id: String, updates: UpdateEventRequest) async throws -> CalendarEvent {
        let body = try encoder.encode(updates)
        let (data, _) = try await makeRequest(
            endpoint: "/events/\(id)",
            method: "PUT",
            body: body
        )
        return try decoder.decode(CalendarEvent.self, from: data)
    }
}
```

### 6. Delete Event

```swift
extension CalendarAPI {
    func deleteEvent(id: String) async throws {
        let _ = try await makeRequest(
            endpoint: "/events/\(id)",
            method: "DELETE"
        )
    }
}
```

---

## WebSocket Integration

For real-time updates across devices:

```swift
import Foundation

class CalendarWebSocket: NSObject, URLSessionWebSocketDelegate {
    private var webSocketTask: URLSessionWebSocketTask?
    private var session: URLSession?

    // Callbacks
    var onEventCreated: ((CalendarEvent) -> Void)?
    var onEventUpdated: ((CalendarEvent) -> Void)?
    var onEventDeleted: ((String) -> Void)?
    var onConnected: (() -> Void)?
    var onDisconnected: (() -> Void)?

    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let dateString = try container.decode(String.self)
            let formatter = ISO8601DateFormatter()
            formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            if let date = formatter.date(from: dateString) {
                return date
            }
            formatter.formatOptions = [.withInternetDateTime]
            if let date = formatter.date(from: dateString) {
                return date
            }
            throw DecodingError.dataCorruptedError(
                in: container,
                debugDescription: "Cannot decode date"
            )
        }
        return decoder
    }()

    func connect() {
        let url = URL(string: "wss://8alls-api.fly.dev/ws")!
        session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)
        webSocketTask = session?.webSocketTask(with: url)
        webSocketTask?.resume()
        receiveMessage()
    }

    func disconnect() {
        webSocketTask?.cancel(with: .goingAway, reason: nil)
        webSocketTask = nil
        session?.invalidateAndCancel()
        session = nil
    }

    private func receiveMessage() {
        webSocketTask?.receive { [weak self] result in
            guard let self = self else { return }

            switch result {
            case .success(let message):
                switch message {
                case .string(let text):
                    self.handleMessage(text)
                case .data(let data):
                    if let text = String(data: data, encoding: .utf8) {
                        self.handleMessage(text)
                    }
                @unknown default:
                    break
                }

                // Continue receiving messages
                self.receiveMessage()

            case .failure(let error):
                print("WebSocket receive error: \(error)")
                self.onDisconnected?()
            }
        }
    }

    private func handleMessage(_ text: String) {
        guard let data = text.data(using: .utf8) else { return }

        do {
            let message = try JSONDecoder().decode(WebSocketMessage.self, from: data)

            switch message.type {
            case "event_created":
                if let event = try? decoder.decode(CalendarEvent.self, from: message.data) {
                    onEventCreated?(event)
                }

            case "event_updated":
                if let event = try? decoder.decode(CalendarEvent.self, from: message.data) {
                    onEventUpdated?(event)
                }

            case "event_deleted":
                if let deletionData = try? JSONDecoder().decode(EventDeletion.self, from: message.data) {
                    onEventDeleted?(deletionData.id)
                }

            default:
                break
            }
        } catch {
            print("Failed to decode WebSocket message: \(error)")
        }
    }

    // MARK: - URLSessionWebSocketDelegate

    func urlSession(
        _ session: URLSession,
        webSocketTask: URLSessionWebSocketTask,
        didOpenWithProtocol protocol: String?
    ) {
        print("WebSocket connected")
        onConnected?()
    }

    func urlSession(
        _ session: URLSession,
        webSocketTask: URLSessionWebSocketTask,
        didCloseWith closeCode: URLSessionWebSocketTask.CloseCode,
        reason: Data?
    ) {
        print("WebSocket disconnected")
        onDisconnected?()
    }
}

// MARK: - WebSocket Message Types

struct WebSocketMessage: Codable {
    let type: String
    let data: Data
    let timestamp: String

    enum CodingKeys: String, CodingKey {
        case type, timestamp
        case data
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        type = try container.decode(String.self, forKey: .type)
        timestamp = try container.decode(String.self, forKey: .timestamp)

        // Decode data as raw JSON
        let dataValue = try container.decode(AnyCodable.self, forKey: .data)
        data = try JSONEncoder().encode(dataValue)
    }
}

struct EventDeletion: Codable {
    let id: String
}

// Helper for decoding any JSON
struct AnyCodable: Codable {
    let value: Any

    init(_ value: Any) {
        self.value = value
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()

        if let bool = try? container.decode(Bool.self) {
            value = bool
        } else if let int = try? container.decode(Int.self) {
            value = int
        } else if let double = try? container.decode(Double.self) {
            value = double
        } else if let string = try? container.decode(String.self) {
            value = string
        } else if let array = try? container.decode([AnyCodable].self) {
            value = array.map { $0.value }
        } else if let dictionary = try? container.decode([String: AnyCodable].self) {
            value = dictionary.mapValues { $0.value }
        } else {
            value = NSNull()
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()

        switch value {
        case let bool as Bool:
            try container.encode(bool)
        case let int as Int:
            try container.encode(int)
        case let double as Double:
            try container.encode(double)
        case let string as String:
            try container.encode(string)
        case let array as [Any]:
            try container.encode(array.map { AnyCodable($0) })
        case let dictionary as [String: Any]:
            try container.encode(dictionary.mapValues { AnyCodable($0) })
        default:
            try container.encodeNil()
        }
    }
}
```

---

## Sync Strategy

Implement this sync manager for optimal performance:

```swift
import Foundation
import Combine

@MainActor
class CalendarSyncManager: ObservableObject {
    @Published var events: [CalendarEvent] = []
    @Published var isLoading = false
    @Published var error: Error?

    private let api = CalendarAPI.shared
    private let webSocket = CalendarWebSocket()
    private var cancellables = Set<AnyCancellable>()

    init() {
        setupWebSocket()
    }

    // MARK: - Initial Load

    func loadEvents(
        startDate: Date? = nil,
        endDate: Date? = nil
    ) async {
        isLoading = true
        error = nil

        do {
            events = try await api.getEvents(
                startDate: startDate,
                endDate: endDate
            )
        } catch {
            self.error = error
        }

        isLoading = false
    }

    // MARK: - CRUD Operations with Optimistic Updates

    func createEvent(_ request: CreateEventRequest) async throws {
        // Optimistic update: add temporary event to UI
        let tempId = UUID().uuidString
        let tempEvent = CalendarEvent(
            id: tempId,
            title: request.title,
            description: request.description,
            startTime: request.startTime,
            endTime: request.endTime,
            allDay: request.allDay,
            location: request.location,
            recurrenceRule: request.recurrenceRule,
            status: request.status,
            eventType: request.eventType,
            color: request.color,
            tags: request.tags,
            attendees: request.attendees,
            reminders: request.reminders,
            createdAt: Date(),
            updatedAt: nil
        )
        events.append(tempEvent)

        do {
            // Create on server
            let createdEvent = try await api.createEvent(request)

            // Replace temp event with real one
            if let index = events.firstIndex(where: { $0.id == tempId }) {
                events[index] = createdEvent
            }
        } catch {
            // Roll back on failure
            events.removeAll { $0.id == tempId }
            throw error
        }
    }

    func updateEvent(id: String, updates: UpdateEventRequest) async throws {
        // Store original for rollback
        guard let index = events.firstIndex(where: { $0.id == id }) else { return }
        let original = events[index]

        // Optimistic update
        if let title = updates.title { events[index].title = title }
        if let description = updates.description { events[index].description = description }
        if let startTime = updates.startTime { events[index].startTime = startTime }
        if let endTime = updates.endTime { events[index].endTime = endTime }
        if let allDay = updates.allDay { events[index].allDay = allDay }
        if let location = updates.location { events[index].location = location }
        if let status = updates.status { events[index].status = status }
        if let color = updates.color { events[index].color = color }
        if let tags = updates.tags { events[index].tags = tags }

        do {
            // Update on server
            let updatedEvent = try await api.updateEvent(id: id, updates: updates)
            events[index] = updatedEvent
        } catch {
            // Roll back on failure
            events[index] = original
            throw error
        }
    }

    func deleteEvent(id: String) async throws {
        // Store for rollback
        guard let index = events.firstIndex(where: { $0.id == id }) else { return }
        let deleted = events[index]

        // Optimistic delete
        events.remove(at: index)

        do {
            try await api.deleteEvent(id: id)
        } catch {
            // Roll back on failure
            events.insert(deleted, at: index)
            throw error
        }
    }

    // MARK: - WebSocket Setup

    private func setupWebSocket() {
        webSocket.onEventCreated = { [weak self] event in
            Task { @MainActor in
                // Only add if not already present (avoid duplicates from own actions)
                if let self = self, !self.events.contains(where: { $0.id == event.id }) {
                    self.events.append(event)
                }
            }
        }

        webSocket.onEventUpdated = { [weak self] event in
            Task { @MainActor in
                if let self = self, let index = self.events.firstIndex(where: { $0.id == event.id }) {
                    self.events[index] = event
                }
            }
        }

        webSocket.onEventDeleted = { [weak self] eventId in
            Task { @MainActor in
                self?.events.removeAll { $0.id == eventId }
            }
        }

        webSocket.onConnected = {
            print("Real-time sync enabled")
        }

        webSocket.onDisconnected = {
            print("Real-time sync disconnected")
        }

        webSocket.connect()
    }

    deinit {
        webSocket.disconnect()
    }
}
```

---

## Error Handling

Best practices for handling API errors:

```swift
enum CalendarError: LocalizedError {
    case networkError(Error)
    case decodingError(Error)
    case serverError(String)
    case notFound
    case invalidInput(String)

    var errorDescription: String? {
        switch self {
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .decodingError:
            return "Failed to process server response"
        case .serverError(let message):
            return message
        case .notFound:
            return "Event not found"
        case .invalidInput(let message):
            return message
        }
    }
}

// Handle errors in your views:
func handleError(_ error: Error) {
    if let urlError = error as? URLError {
        switch urlError.code {
        case .notConnectedToInternet:
            showAlert("No internet connection")
        case .timedOut:
            showAlert("Request timed out")
        default:
            showAlert("Network error occurred")
        }
    } else if let nsError = error as NSError? {
        showAlert(nsError.localizedDescription)
    } else {
        showAlert("An unexpected error occurred")
    }
}
```

---

## Example Implementation

Complete SwiftUI view example:

```swift
import SwiftUI

struct CalendarView: View {
    @StateObject private var syncManager = CalendarSyncManager()
    @State private var showingCreateEvent = false
    @State private var selectedDate = Date()

    var body: some View {
        NavigationView {
            List {
                ForEach(syncManager.events) { event in
                    EventRow(event: event)
                        .swipeActions(edge: .trailing) {
                            Button(role: .destructive) {
                                Task {
                                    try? await syncManager.deleteEvent(id: event.id)
                                }
                            } label: {
                                Label("Delete", systemImage: "trash")
                            }
                        }
                }
            }
            .navigationTitle("Calendar")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showingCreateEvent = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showingCreateEvent) {
                CreateEventView(syncManager: syncManager)
            }
            .task {
                await syncManager.loadEvents()
            }
            .overlay {
                if syncManager.isLoading {
                    ProgressView()
                }
            }
            .alert("Error", isPresented: .constant(syncManager.error != nil)) {
                Button("OK") {
                    syncManager.error = nil
                }
            } message: {
                if let error = syncManager.error {
                    Text(error.localizedDescription)
                }
            }
        }
    }
}

struct EventRow: View {
    let event: CalendarEvent

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(event.title)
                .font(.headline)

            if let description = event.description {
                Text(description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }

            HStack {
                Text(event.startTime, style: .time)
                Text("-")
                Text(event.endTime, style: .time)
            }
            .font(.caption)
            .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
    }
}

struct CreateEventView: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject var syncManager: CalendarSyncManager

    @State private var title = ""
    @State private var description = ""
    @State private var startTime = Date()
    @State private var endTime = Date().addingTimeInterval(3600)
    @State private var allDay = false
    @State private var location = ""
    @State private var eventType = ""
    @State private var color = "#4f46e5"

    var body: some View {
        NavigationView {
            Form {
                Section("Event Details") {
                    TextField("Title", text: $title)
                    TextField("Description", text: $description)
                    TextField("Location", text: $location)
                }

                Section("Time") {
                    Toggle("All Day", isOn: $allDay)
                    DatePicker("Start", selection: $startTime, displayedComponents: allDay ? [.date] : [.date, .hourAndMinute])
                    DatePicker("End", selection: $endTime, displayedComponents: allDay ? [.date] : [.date, .hourAndMinute])
                }

                Section("Optional") {
                    TextField("Event Type", text: $eventType)
                    ColorPicker("Color", selection: Binding(
                        get: { Color(hex: color) ?? .blue },
                        set: { color = $0.toHex() }
                    ))
                }
            }
            .navigationTitle("New Event")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        Task {
                            await createEvent()
                        }
                    }
                    .disabled(title.isEmpty)
                }
            }
        }
    }

    private func createEvent() async {
        let request = CreateEventRequest(
            title: title,
            description: description.isEmpty ? nil : description,
            startTime: startTime,
            endTime: endTime,
            allDay: allDay,
            location: location.isEmpty ? nil : location,
            recurrenceRule: nil,
            status: .confirmed,
            eventType: eventType.isEmpty ? nil : eventType,
            color: color,
            tags: nil,
            attendees: nil,
            reminders: nil
        )

        do {
            try await syncManager.createEvent(request)
            dismiss()
        } catch {
            print("Failed to create event: \(error)")
        }
    }
}

// Color helpers
extension Color {
    init?(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            return nil
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }

    func toHex() -> String {
        let uic = UIColor(self)
        guard let components = uic.cgColor.components, components.count >= 3 else {
            return "#000000"
        }
        let r = Float(components[0])
        let g = Float(components[1])
        let b = Float(components[2])
        return String(format: "#%02lX%02lX%02lX", lroundf(r * 255), lroundf(g * 255), lroundf(b * 255))
    }
}
```

---

## Testing Checklist

Before deploying your calendar app, test these scenarios:

- [ ] **Create Event**: Create a new event and verify it appears in the list
- [ ] **Update Event**: Edit an event and confirm changes are saved
- [ ] **Delete Event**: Delete an event and verify it's removed
- [ ] **Date Filtering**: Filter events by date range
- [ ] **Offline Mode**: Test behavior when network is unavailable
- [ ] **Real-time Sync**: Open app on two devices and verify changes sync
- [ ] **All-Day Events**: Create and display all-day events correctly
- [ ] **Recurring Events**: Test events with recurrence rules
- [ ] **Time Zones**: Verify events display correctly across time zones
- [ ] **Error Handling**: Test with invalid data and network errors

---

## API Endpoints Reference

### Base URL
```
https://8alls-api.fly.dev/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | Get all events (with optional filters) |
| GET | `/events/{id}` | Get single event |
| GET | `/events/date/{YYYY-MM-DD}` | Get events for specific date |
| POST | `/events` | Create new event |
| PUT | `/events/{id}` | Update event |
| DELETE | `/events/{id}` | Delete event |

### Query Parameters (for GET `/events`)

| Parameter | Type | Description |
|-----------|------|-------------|
| `start_date` | ISO 8601 DateTime | Filter events starting from this date |
| `end_date` | ISO 8601 DateTime | Filter events until this date |
| `event_type` | String | Filter by event type |
| `status` | String | Filter by status (confirmed/tentative/cancelled) |

---

## Additional Resources

- **API Documentation:** https://8alls-api.fly.dev/docs
- **API Health Check:** https://8alls-api.fly.dev/health
- **WebSocket Endpoint:** wss://8alls-api.fly.dev/ws

---

## Notes for Implementation

1. **Date Handling**: The API uses ISO 8601 format. Always use `ISO8601DateFormatter` in Swift.

2. **WebSocket Connection**: The WebSocket connection will automatically reconnect if it drops. Implement exponential backoff for reconnection attempts.

3. **Optimistic Updates**: The sync manager implements optimistic updates for better UX. Changes appear instantly in the UI and are rolled back if the server request fails.

4. **Memory Management**: Use `@MainActor` for UI updates and `weak self` in closures to avoid retain cycles.

5. **Testing**: Test with the live API at `https://8alls-api.fly.dev/api`. No authentication is required.

6. **Rate Limiting**: Currently no rate limiting, but implement exponential backoff for retries if you get network errors.

---

**Last Updated:** January 31, 2026
**API Version:** 1.0.0
**Contact:** For issues with the API, check https://8alls-api.fly.dev/health
