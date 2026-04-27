import networkx as nx
import matplotlib.pyplot as plt

# Создаём ориентированный граф
G = nx.DiGraph()

# Вершины
vertices = ['Л', 'Ж', 'З', 'И', 'К', 'Е', 'Д', 'Г', 'В', 'Б', 'А']
G.add_nodes_from(vertices)

# Дуги с весами (все из таблицы)
edges = [
    ('Б', 'А', 10),
    ('В', 'А', 8),
    ('В', 'Б', 4),
    ('Г', 'А', 8),
    ('Г', 'Д', 5),
    ('Д', 'А', 11),
    ('Е', 'Б', 15),
    ('Е', 'В', 16),
    ('Ж', 'В', 16),
    ('Ж', 'Г', 14),
    ('Ж', 'Д', 18),
    ('З', 'В', 16),
    ('З', 'Г', 17),
    ('З', 'Д', 11),
    ('З', 'Е', 7),
    ('И', 'Г', 7),
    ('К', 'Е', 3),
    ('Л', 'А', 20),
    ('Л', 'Б', 15),
    ('Л', 'В', 13),
    ('Л', 'Г', 22),
    ('Л', 'К', 16)
]

for u, v, w in edges:
    G.add_edge(u, v, weight=w)

# Ручная раскладка — чтобы Л и Ж не сливались
pos = {
    'Л': (0, 5.0),      # старт слева
    'Ж': (1.2, 6.2),    # Ж выше и чуть правее
    'З': (1.0, 3.8),
    'И': (0.8, 2.4),
    'К': (2.3, 5.4),    # К правее Л
    'Е': (3.6, 4.8),
    'Г': (5.0, 4.0),
    'Д': (5.2, 2.6),
    'В': (4.4, 3.2),
    'Б': (6.0, 3.6),
    'А': (7.2, 3.0)     # сток справа
}

# Цвета узлов: Л — зелёный (источник), А — красный (сток), остальные — голубой
node_colors = []
for node in G.nodes():
    if node == 'Л':
        node_colors.append('#aaffaa')   # светло-зелёный
    elif node == 'А':
        node_colors.append('#ffaaaa')   # светло-красный
    else:
        node_colors.append('#cce5ff')   # светло-голубой

# Рисуем граф
plt.figure(figsize=(14, 9))

nx.draw_networkx_nodes(
    G, pos,
    node_color=node_colors,
    node_size=1100,
    edgecolors='black',
    linewidths=1.5
)

nx.draw_networkx_edges(
    G, pos,
    arrows=True,
    arrowstyle='->',
    arrowsize=20,
    edge_color='gray',
    width=1.3
)

# Метки вершин
nx.draw_networkx_labels(
    G, pos,
    font_size=13,
    font_weight='bold',
    font_family='DejaVu Sans'  # обычно хорошо отображает кириллицу
)

# Метки весов на рёбрах
edge_labels = nx.get_edge_attributes(G, 'weight')
nx.draw_networkx_edge_labels(
    G, pos,
    edge_labels=edge_labels,
    font_size=9,
    font_color='darkred',
    label_pos=0.5,
    verticalalignment='bottom'
)

plt.title("Ориентированный граф — Задание 9.3\n(расстояния между городами)", fontsize=15, pad=20)
plt.axis('off')
plt.tight_layout()
plt.show()

# Если хочешь сохранить картинку в файл:
# plt.savefig("graph_9.3.png", dpi=300, bbox_inches='tight')