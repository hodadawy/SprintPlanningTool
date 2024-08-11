from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import datetime

app = Flask(__name__)
CORS(app)

@app.route('/plan', methods=['POST'])
def plan_sprint():
    data = request.json
    num_developers = data['num_developers']
    tickets = data['tickets']  # A list of dictionaries with 'id', 'days', and 'priority'

    # Sort tickets by priority (ascending)
    sorted_tickets = sorted(tickets, key=lambda x: x['priority'])

    num_days_in_sprint = 10  # Assume 10 working days per sprint
    developer_sprints = {i: [] for i in range(num_developers)}
    sprints = []

    # Function to create a new sprint with the current tickets
    def create_sprint(sprint_tickets):
        sprint_timeline = []
        developer_days_left = {i: num_days_in_sprint for i in range(num_developers)}
        for ticket in sprint_tickets:
            assigned = False
            for dev in range(num_developers):
                if developer_days_left[dev] >= ticket['days']:
                    developer_sprints[dev].append(ticket)
                    developer_days_left[dev] -= ticket['days']
                    sprint_timeline.append({
                        'developer': dev,
                        'ticket': ticket['id'],
                        'start_day': num_days_in_sprint - developer_days_left[dev] - ticket['days'] + 1,
                        'end_day': num_days_in_sprint - developer_days_left[dev]
                    })
                    assigned = True
                    break
            if not assigned:
                # Mark ticket for next sprint
                remaining_tickets.append(ticket)
        return sprint_timeline

    remaining_tickets = []
    while sorted_tickets or remaining_tickets:
        sprint_tickets = sorted_tickets[:]
        sprint_timeline = create_sprint(sprint_tickets)
        if sprint_timeline:
            sprints.append({
                'tasks': sprint_timeline
            })
        sorted_tickets = remaining_tickets
        remaining_tickets = []

    return jsonify({'sprints': sprints})

if __name__ == '__main__':
    app.run(debug=True)