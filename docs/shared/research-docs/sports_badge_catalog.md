# Extended Badge Categories for a Gamified Sports Platform

This document outlines badge categories and examples for a sports-focused gamified platform (e.g., starting with pickleball). It expands on common badge types to support a wider range of user motivations and behavior.

---

## Coaching & Mentoring
Badges for users who help others improve, mentor new players, or lead coaching sessions.

- **Mentor Coach** (Rare, 200 XP)  
  `{"players_mentored": 5, "min_sessions_each": 1}`
- **Skill Guru** (Epic, 300 XP)  
  `{"mentees_reached_level": 10, "mentees_count": 3}`
- **Community Trainer** (Uncommon, 150 XP)  
  `{"training_sessions_hosted": 1, "participants_min": 5}`

---

## Hosting & Organizing
Recognizes players who create opportunities for others to play or lead community events.

- **Event Organizer** (Rare, 250 XP)  
  `{"events_hosted": 3, "avg_participants": 10}`
- **League Commissioner** (Epic, 400 XP)  
  `{"tournaments_created": 1, "teams_involved": 8}`
- **Community Host** (Uncommon, 150 XP)  
  `{"pickup_games_hosted": 5}`

---

## Fitness Goals
Focuses on speed, distance, endurance — aligns with broader fitness apps.

- **Speed Demon** (Uncommon, 100 XP)  
  `{"top_speed_km_per_hr": 20}`
- **Marathon Finisher** (Rare, 300 XP)  
  `{"single_run_distance_km": 42.2}`
- **Century Rider** (Rare, 300 XP)  
  `{"single_ride_distance_km": 160.9}`

---

## Versatility & Multi-Role
Encourages trying different formats, sports, roles.

- **Jack of All Sports** (Rare, 200 XP)  
  `{"distinct_sports_played": 5}`
- **Dual Threat** (Common, 50 XP)  
  `{"roles_played": 2}`
- **Triathlete** (Uncommon, 150 XP)  
  `{"sports_completed": ["running", "cycling", "swimming"]}`

---

## Competition & Tournaments
Marks achievements in tournaments or competitive modes.

- **Tournament Champion** (Legendary, 500 XP)  
  `{"tournament_wins": 1}`
- **Podium Finisher** (Epic, 300 XP)  
  `{"top3_finishes": 1}`
- **Head-to-Head Hero** (Uncommon, 100 XP)  
  `{"duels_won": 50}`

---

## Team Dynamics & Leadership
Badges for team contribution, leadership, and support roles.

- **Captain’s Crest** (Rare, 150 XP)  
  `{"games_captained": 10}`
- **Team Champion** (Epic, 300 XP)  
  `{"championships_won": 1, "team_member": true}`
- **Playmaker** (Uncommon, 100 XP)  
  `{"assists_total": 50}`

---

## Seasonal & Special Events
Badges that rotate or are time-limited — tied to holidays or campaigns.

- **Holiday Hero** (Common, 50 XP)  
  `{"event_type": "holiday", "event_completed": true}`
- **Seasoned Veteran** (Uncommon, 100 XP)  
  `{"seasons_participated": ["Spring", "Summer", "Fall", "Winter"]}`
- **New Year Sprinter** (Rare, 150 XP)  
  `{"challenge_date": "2025-01-01", "completed": true}`

---

## Achievement Sequences & Meta-Badges
Badges earned for earning other badges — promotes collection and progression.

- **Badge Collector** (Uncommon, 0 XP)  
  `{"badges_earned_total": 10}`
- **Grand Slam** (Epic, 400 XP)  
  `{"badges_required": ["Winter Champ", "Spring Champ", "Summer Champ", "Fall Champ"]}`
- **Master of All** (Legendary, 500 XP)  
  `{"completed_categories": 8}`

---

You can build on this catalog for expansion, personalization, or localization later. Let me know if you want CSV or JSON output versions next.

