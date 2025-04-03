const roadmap = document.querySelector(".roadmap");
let addedItems = 0;

const itemStatus = {
  notDropped: "not-dropped",
  dropped: "dropped",
};

function setAddedItems() {
  if (addedItems >= 4) return;

  addedItems++;
  roadmap.setAttribute("data-added-items", addedItems);

  const activeProgress = document.querySelector(
    ".roadmap__head_progress--active",
  );
  if (addedItems === 0) {
    activeProgress.style.width = activeProgress.dataset.minWidth;
  } else {
    activeProgress.style.width = `${addedItems * 25}%`;
  }
}

function getItemStatus(item) {
  return item.getAttribute("data-status");
}

function addAttributes() {
  const roadmapItems = document.querySelectorAll(".roadmap__item");
  roadmapItems.forEach((item, index) => {
    item.setAttribute("data-item-id", index + 1);
    item.setAttribute("data-status", itemStatus.notDropped);
    item.setAttribute("draggable", "true");
  });

  const storageCells = document.querySelectorAll(".roadmap__drageble_item");
  storageCells.forEach((item, index) => {
    item.setAttribute("data-storage-id", index + 1);
  });
}

function dragMoveListener(event) {
  var target = event.target;
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
  target.style.transform = "translate(" + x + "px, " + y + "px)";
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

function initInteract() {
  interact(".roadmap__item").draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrict({
        restriction: ".roadmap__content",
        endOnly: true,
      }),
    ],
    onmove(e) {
      const itemElement = e.target;
      const currentItemStatus = getItemStatus(itemElement);

      if (currentItemStatus == itemStatus.notDropped) {
        dragMoveListener(e);
      }
    },
  });

  interact(".roadmap__drageble_item").dropzone({
    accept: ".roadmap__item",
    overlap: 0.75,
    ondrop(event) {
      const dropZone = event.target;
      const storageId = dropZone.dataset.storageId;

      const itemElement = event.relatedTarget;
      const itemId = itemElement.dataset.itemId;

      dropZone.setAttribute("data-status", "dropped");
      roadmap.classList.add(`_added_section_${itemId}`);

      console.log(`Элемент ${itemId} помещен в ячейку ${storageId}`);

      if (itemId === storageId) {
        setAddedItems();
        interact(itemElement).draggable(false);
        itemElement.setAttribute("data-status", itemStatus.dropped);
        itemElement.classList.add("_added");
      }
    },
  });
}

addAttributes();
initInteract();
