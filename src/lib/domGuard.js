// Browser extensions (Grammarly, translators, AI helpers…) sometimes move or wrap parts of the page.
// When React later updates those nodes it calls removeChild/insertBefore on the wrong parent, which
// throws and blanks the whole app. These guards make those calls safe instead of fatal.
export function guardAgainstExtensionDomChanges() {
  if (typeof Node !== 'function' || !Node.prototype || Node.prototype.__pmGuarded) return

  const removeChild = Node.prototype.removeChild
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      // Already moved elsewhere by an extension: detach it from wherever it is now.
      if (child.parentNode) child.parentNode.removeChild(child)
      return child
    }
    return removeChild.call(this, child)
  }

  const insertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      // Reference node was moved by an extension: append instead of throwing.
      return this.appendChild(newNode)
    }
    return insertBefore.call(this, newNode, referenceNode)
  }

  Node.prototype.__pmGuarded = true
}
