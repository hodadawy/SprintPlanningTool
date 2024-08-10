from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import datetime


app = Flask(__name__)
CORS(app)

@app.route('/plan', methods=['POST'])
def plan_sprint():
    data = request.json
    num_developers = data['num_developers']
    tickets = data['tickets']

    #sort tickets
    sorted_tickets = sorted(tickets, key=lambda x: x['priority'])

    #set up timeline
    num_days_in_sprint = 10
    developers_sprints = {i: [] for i in range(num_developers)}
    developers_days_left = {i: num_days_in_sprint for i in range(num_developers)}

    sprint_timeline = []

    for ticket in sorted_tickets:
        assigned = False
        for dev in range(num_developers):
            if developers_days_left[dev] >= ticket['days']:
                #
                start_day = num_days_in_sprint - developers_days_left[dev]
                end_day = start_day + ticket['days'] - 1
                sprint_timeline.append({
                    'developer': dev,
                    'ticket': ticket['id'],
                    'start_day': start_day,
                    'end_day':  end_day 
                })
                developers_days_left[dev] -= ticket['days']
                assigned = True
                break
        if not assigned:
            pass
    return jsonify(sprint_timeline)
        
if __name__ == '__main__':
    app.run(debug=True)