// JSLoggerModule.swift
// Provides a native bridge for logging JavaScript errors to os_log and a persistent file.
// Subsystem: com.gssclient.js  Category: error

import Foundation
import os
import React

@objc(JSLoggerModule)
class JSLoggerModule: NSObject { // Do not explicitly adopt RCTBridgeModule to avoid header issues; @objc name exports module.
  @objc static func requiresMainQueueSetup() -> Bool { return false }

  private let subsystem = "com.gssclient.js"
  private let category = "error"
  private let maxFileBytes: UInt64 = 1_000_000 // 1MB rotation threshold
  private let fileName = "js-errors.log"

  @objc func logError(_ payload: String) {
    let logger = Logger(subsystem: subsystem, category: category)
    logger.error("\(payload, privacy: .public)")
    appendLine(payload)
  }

  private func appendLine(_ line: String) {
    guard let caches = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first else { return }
    let fileURL = caches.appendingPathComponent(fileName)
    rotateIfNeeded(fileURL)
    let data = (line + "\n").data(using: .utf8) ?? Data()
    if FileManager.default.fileExists(atPath: fileURL.path) {
      do {
        let handle = try FileHandle(forWritingTo: fileURL)
        try handle.seekToEnd()
        try handle.write(contentsOf: data)
        try handle.close()
      } catch {
        // Fallback: try rewriting file
        try? data.write(to: fileURL, options: .atomic)
      }
    } else {
      try? data.write(to: fileURL, options: .atomic)
    }
  }

  private func rotateIfNeeded(_ fileURL: URL) {
    guard let attrs = try? FileManager.default.attributesOfItem(atPath: fileURL.path),
          let size = attrs[.size] as? UInt64, size > maxFileBytes else { return }
    let rotated = fileURL.deletingLastPathComponent().appendingPathComponent("js-errors.log.1")
    // Remove previous rotated file
    _ = try? FileManager.default.removeItem(at: rotated)
    _ = try? FileManager.default.moveItem(at: fileURL, to: rotated)
  }
}
