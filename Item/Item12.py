total_outcomes = 6 * 6

# 1. ความน่าจะเป็นที่ผลรวมของแต้มเป็น 10
# (4,6), (5,5), (6,4)
sum_10_ways = 3
sum = sum_10_ways / total_outcomes * 100  

# 2. ความน่าจะเป็นที่ผลต่างของแต้มเป็น 2
# (1,3), (2,4), (3,5), (4,6), (3,1), (4,2), (5,3), (6,4)
diff_2_ways = 8
diff = diff_2_ways / total_outcomes * 100

print(f"โอกาสที่ผลรวมของลูกเต๋าเป็น 10: {sum_10_ways}/{total_outcomes} = {sum:.2f}%")
print(f"โอกาสที่ผลต่างของลูกเต๋าเป็น 2: {diff_2_ways}/{total_outcomes} = {diff:.2f}%")