def Calculate(x):
    water = 5832  
    for day in range(x):
        water -= water / 3  
        # print(f"Day {day+1}: {round(water, 2)} liter")
    return round(water, 2) 

days = int(input("Enter the number of days : "))
y = Calculate(days)
print(f"After {days} day There will be water left {y} liter")
