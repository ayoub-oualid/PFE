import os
import json

def read_gitignore_rules(gitignore_path):
    rules = []
    with open(gitignore_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                rules.append(line)
    return rules

def is_ignored(file_path, gitignore_rules):
    # Check if the file matches any of the .gitignore rules
    for rule in gitignore_rules:
        if os.path.normpath(file_path).endswith(rule) or os.path.basename(file_path) == rule:
            return True
    return False

def get_directory_tree(path, gitignore_rules):
    tree = {}
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        if is_ignored(item_path, gitignore_rules):
            continue  # Skip ignored files/directories

        if os.path.isdir(item_path):
            tree[item] = get_directory_tree(item_path, gitignore_rules)
        else:
            try:
                with open(item_path, 'r', encoding='utf-8') as file:
                    content = file.read()
                tree[item] = content  # Store file content
            except Exception as e:
                tree[item] = str(e)  # Store error message if file can't be read
    return tree

def main(directory):
    gitignore_path = os.path.join(directory, '.gitignore')
    gitignore_rules = read_gitignore_rules(gitignore_path) if os.path.exists(gitignore_path) else []
    
    directory_tree = get_directory_tree(directory, gitignore_rules)
    
    # Save the directory tree as JSON
    with open('directory_tree.json', 'w', encoding='utf-8') as json_file:
        json.dump(directory_tree, json_file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main(".")  # Change this to the desired directory
