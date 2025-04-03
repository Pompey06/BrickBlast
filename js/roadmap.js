const roadmap = document.querySelector(".roadmap");
let addedItems = 0;

const itemStatus = {
  notDropped: "not-dropped",
  dropped: "dropped",
};

/* Attributes */
function setAddedItems() {
  if (addedItems >= 4) return;

  addedItems++;
  roadmap.setAttribute("data-added-items", addedItems);

  const activeProgress = document.querySelector(
    ".roadmap__head_progress--active",
  );

  let progressWidth =
    addedItems == 0 ? activeProgress.dataset.minWidth : `${addedItems * 25}%`;
  document.documentElement.style.setProperty(
    "--active-progress-width",
    `${progressWidth}`,
  );
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

/*
 * Drag and drop
 */
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
        restriction: ".roadmap ._container",
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

      console.log(`Элемент ${itemId} помещен в ячейку ${storageId}`);

      if (itemId === storageId) {
        dropZone.setAttribute("data-status", "dropped");
        roadmap.classList.add(`_added_section_${itemId}`);
        dropZone.classList.add("_active");

        setAddedItems();
        interact(itemElement).draggable(false);
        itemElement.setAttribute("data-status", itemStatus.dropped);
        itemElement.classList.add("_added");
        openRoadmapText(itemId);
      }
    },
  });
}

/*
 * Open roadmap text
 */
const roadmapTexts = document.querySelectorAll("[data-roadmap-text]");
const roadmapWrap = document.querySelector(".roadmap__wrap");
const draggableWrap = document.querySelector(".roadmap__drageble");
const roadmapItems = document.querySelectorAll(".roadmap__item");
const storageImages = document.querySelectorAll("[data-staroge-image]");

function initCloseRoadmapTexts() {
  const roadmapClose = document.querySelectorAll(".roadmap__cross");
  roadmapClose.forEach((close) => {
    close.addEventListener("click", () => {
      roadmapTexts.forEach((item) => {
        item.classList.add("_hide");
      });
      console.log("close");

      draggableWrap.classList.remove("_hide_anim");
      draggableWrap.classList.remove("_anim");

      roadmapItems.forEach((item) => {
        item.classList.remove("_hide_item");
      });
    });
  });
}

function openRoadmapText(itemId) {
  draggableWrap.classList.add("_anim");
  draggableWrap.classList.add("_anim");

  roadmapItems.forEach((item) => {
    item.classList.add("_hide_item");
  });

  setTimeout(() => {
    draggableWrap.classList.add("_hide_anim");
    const roadmapText = document.querySelector(
      `[data-roadmap-text="${itemId}"]`,
    );
    roadmapText.classList.remove("_hide");
  }, 1000);
}

function initClickRoadmapItems() {
  storageImages.forEach((item) => {
    item.addEventListener("click", () => {
      console.log("click");
      const itemId = item.dataset.starogeImage;
      openRoadmapText(itemId);
    });
  });
}

function initRoadmap() {
  addAttributes();
  initInteract();
  initCloseRoadmapTexts();
  initClickRoadmapItems();
}

initRoadmap();
