---
name: railway-domain
description: Japanese railway domain glossary mapping Japanese terms to English type names and identifiers. Use when naming variables, types, interfaces, functions, or components related to railway concepts: train types, track structures, timetables, operations, stations, diagrams, or any railway-specific terminology.
---

# Railway Domain Glossary

## Infrastructure

| Japanese | English Identifier | Notes |
|----------|-------------------|-------|
| 路線 | `RailwayLine` | Physical infrastructure management unit |
| 駅 | `Station` | Passenger boarding/alighting facility |
| 線路・番線 | `Track` | Unified model for mainline, platform, and connecting tracks |
| 線路接続 | `TrackConnection` | Directed connection between Tracks |
| キロ程 | `kilometrage` | Distance from line start (km) |
| 複線 | double track | Separate outbound/inbound tracks |
| 単線 | single track | Shared track for both directions |
| 複々線 | quadruple track | Four tracks (express/local line separation) |
| 連絡線 | connecting track | Route for through service to another line |
| 信号場 | signal station | Passing point with no platforms |

## Train Operations

| Japanese | English Identifier | Notes |
|----------|-------------------|-------|
| 列車種別 | `TrainType` | Express/local classification; holds color and line style |
| 列車番号 | `TrainSegment.number` | Operational identifier (e.g. "3001M", "25M") |
| 列車名 | `TrainService.name` | Passenger-facing name (e.g. "Hayabusa") |
| 号数 | `TrainService.number` | Passenger-facing ordinal (e.g. "No. 1") |
| 上り | `inbound` | Direction toward origin terminus |
| 下り | `outbound` | Direction toward destination terminus |
| 停車 | `stop` | StopType: train stops at station |
| 通過 | `pass` | StopType: train passes without stopping |
| 行先 | `Destination` | Train's final destination |
| 直通運転 | through service | Continuous operation across railway lines |
| 分割 | `split` | Separation of a coupled train |
| 併合（併結） | `join` | Coupling of separate trains |

## Timetable & Diagram

| Japanese | English Identifier | Notes |
|----------|-------------------|-------|
| ダイヤグラム | diagram | 2D graph of time × station |
| スジ | train line (in diagram) | Line representing a train on the diagram |
| 時刻表 | timetable | Arrival/departure times by station and train |
| 着時刻 | `entryTime` | Arrival time at station (in TrackTime) |
| 発時刻 | `exitTime` | Departure time from station (in TrackTime) |
| 表示起点 | `startTime` | Diagram display start time; default: 4:00 |

## Service & Operations

| Japanese | English Identifier | Notes |
|----------|-------------------|-------|
| 運行単位 | `TrainSegment` | Unit for conflict detection and timetable display |
| サービス単位 | `TrainService` | Passenger guidance unit; links Segments |
| 運用（行路） | Operation (future) | Daily rolling stock operation plan |
| 経路ビュー | `DiagramView` | Station sequence definition for display |

## File

| Japanese | English Identifier | Notes |
|----------|-------------------|-------|
| 路線ファイル | `RailwayFile` | One file per railway network |
| ファイル拡張子 | `.cdia` | Short for "CloudDia" |
